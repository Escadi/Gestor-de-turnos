const db = require("../Model");
const Abences = db.abences;
const rolUser = require("../status/rolUser");


exports.create = (req, res) => {
    const abences = {
        idWorker: req.body.idWorker,
        typeAbences: req.body.typeAbences,
        timeStart: req.body.timeStart,
        timeEnd: req.body.timeEnd,
        applicationDate: req.body.applicationDate,
        filename: req.file ? req.file.filename : null,
        details: req.body.details,
        status: req.body.status
    };

    Abences.create(abences)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Error al crear la ausencia.'
            });
        });
}

exports.update = async (req, res) => {
    const id = req.params.id;
    const status = req.body.status;

    try {
        if (status === 'Aprobada') {
            const absence = await Abences.findByPk(id);
            if (absence && absence.timeStart && absence.timeEnd) {
                const start = new Date(absence.timeStart);
                const end = new Date(absence.timeEnd);

                // 1. Ensure a timeShift exists for this type
                let [typeTimeShift] = await db.timeShifts.findOrCreate({
                    where: { hours: absence.typeAbences },
                    defaults: { hours: absence.typeAbences }
                });

                // 2. Create shifts for each day in range
                let currentDate = new Date(start);
                while (currentDate <= end) {
                    const dateStr = currentDate.toISOString().split('T')[0];

                    const [newShift] = await db.shifts.findOrCreate({
                        where: { date: dateStr, idTimeShift: typeTimeShift.id },
                        defaults: {
                            date: dateStr,
                            idTimeShift: typeTimeShift.id,
                            state: 'PUBLICADO',
                            locked: true
                        }
                    });

                    await db.workerShift.findOrCreate({
                        where: { idWorker: absence.idWorker, idShift: newShift.id },
                        defaults: { idWorker: absence.idWorker, idShift: newShift.id }
                    });

                    currentDate.setDate(currentDate.getDate() + 1);
                }
            }
        }

        const abencesUpdates = {
            typeAbences: req.body.typeAbences,
            timeStart: req.body.timeStart,
            timeEnd: req.body.timeEnd,
            details: req.body.details,
            status: req.body.status
        };

        if (req.file) {
            abencesUpdates.filename = req.file.filename;
        }

        const [num] = await Abences.update(abencesUpdates, { where: { id: id } });
        if (num == 1) {
            res.send({ message: 'Ausencia actualizada correctamente.' });
        } else {
            res.send({ message: `No se pudo actualizar la ausencia con id=${id}.` });
        }
    } catch (err) {
        console.error("Error updating absence and creating shifts:", err);
        res.status(500).send({ message: err.message || 'Error al actualizar la ausencia.' });
    }
}

exports.delete = (req, res) => {
    const id = req.params.id;

    Abences.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: 'Ausencia eliminada correctamente.' });
            } else {
                res.send({ message: `No se pudo eliminar la ausencia con id=${id}.` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Error al eliminar la ausencia.'
            });
        });
}

const getDescendantFunctions = async (parentId, nameFuctionModel) => {
    const children = await nameFuctionModel.findAll({ where: { parentId: parentId } });
    let descendantIds = children.map(c => c.id);
    for (const child of children) {
        const nestedIds = await getDescendantFunctions(child.id, nameFuctionModel);
        descendantIds = descendantIds.concat(nestedIds);
    }
    return descendantIds;
};

exports.findAll = async (req, res) => {
    const idWorker = req.query.idWorker;
    const role = req.query.role;

    try {
        let condition = {};

        // Determinar si el usuario puede ver ausencias ajenas
        const isManager = role === rolUser.ADMIN ||
            role === rolUser.SUPERVISOR ||
            role === rolUser.DIRECTOR ||
            role === rolUser.RRHH;

        const showSubordinates = req.query.subordinates === 'true';

        if (idWorker && isManager && showSubordinates) {
            // El usuario es un gestor pidiendo ver ausencias de su equipo
            const manager = await db.worker.findByPk(idWorker);
            if (manager) {
                // Encontrar todas las funciones subordinadas recursivamente
                const descendantFunctionIds = await getDescendantFunctions(manager.idFuction, db.nameFuction);

                // Encontrar trabajadores que tengan esas funciones
                const subordinateWorkers = await db.worker.findAll({
                    where: { idFuction: descendantFunctionIds },
                    attributes: ['id']
                });
                const subordinateIds = subordinateWorkers.map(w => w.id);

                // EXCLUSIÓN: No mostrar las ausencias de uno mismo en el panel de aprobaciones
                condition.idWorker = { [db.Sequelize.Op.in]: subordinateIds, [db.Sequelize.Op.ne]: idWorker };
            }
        } else if (idWorker) {
            // Un trabajador (gestor o no) pidiendo ver SUS PROPIAS ausencias
            condition.idWorker = idWorker;
        } else if (role === rolUser.ADMIN) {
            condition = {};
        } else {
            condition = { idWorker: -1 };
        }

        const data = await Abences.findAll({
            where: condition,
            order: [['applicationDate', 'DESC']],
            include: [{
                model: db.worker,
                as: 'worker',
                attributes: ['id', 'name', 'surname']
            }]
        });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving absences."
        });
    }
};