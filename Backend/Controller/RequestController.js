const db = require("../Model");
const Request = db.request;
const rolUser = require("../status/rolUser");


exports.create = (req, res) => {
    // Validate request
    if (!req.body.idWorker || !req.body.idType) {
        res.status(400).send({
            message: "idWorker and idType are required fields!"
        });
        return;
    }

    // Create a Request
    const request = {
        applicationDate: req.body.applicationDate || new Date(),
        status: req.body.status || 'Pendiente',
        idWorker: req.body.idWorker,
        idType: req.body.idType,
        details: req.body.details || null,
        timeStart: req.body.timeStart || null,
        timeEnd: req.body.timeEnd || null
    };

    // Save Request in the database
    Request.create(request)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Request."
            });
        });
};

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

        // Determinar si el usuario puede ver peticiones ajenas
        const isManager = role === rolUser.ADMIN ||
            role === rolUser.SUPERVISOR ||
            role === rolUser.DIRECTOR ||
            role === rolUser.RRHH;

        const showSubordinates = req.query.subordinates === 'true';

        if (idWorker && isManager && showSubordinates) {
            // El usuario es un gestor pidiendo ver peticiones de su equipo
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

                // EXCLUSIÓN: No mostrar las peticiones de uno mismo en el panel de aprobaciones
                condition.idWorker = { [db.Sequelize.Op.in]: subordinateIds, [db.Sequelize.Op.ne]: idWorker };
            }
        } else if (idWorker) {
            // Un trabajador (gestor o no) pidiendo ver SUS PROPIAS peticiones
            condition.idWorker = idWorker;
        } else if (role === rolUser.ADMIN) {
            // Si es ADMIN y no se pasa idWorker, por defecto ve todo? 
            // Para evitar confusión, si no hay idWorker pero es admin mandamos todo.
            condition = {};
        } else {
            // Caso por defecto: no ve nada si no cumple condiciones
            condition = { idWorker: -1 };
        }

        const data = await Request.findAll({
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
            message: err.message || "Some error occurred while retrieving requests."
        });
    }
};
exports.update = async (req, res) => {
    const id = req.params.id;
    const status = req.body.status;

    try {
        // If approving, check if it's a Vacation request to auto-create shifts
        if (status === 'Aprobada') {
            const request = await Request.findByPk(id, {
                include: [{ model: db.requestType, as: 'requestType' }]
            });

            if (request && request.requestType && request.requestType.typeRequest.toLowerCase() === 'vacaciones') {
                if (request.timeStart && request.timeEnd) {
                    const start = new Date(request.timeStart);
                    const end = new Date(request.timeEnd);

                    // 1. Ensure a "Vacaciones" timeShift exists
                    let [vacaTimeShift] = await db.timeShifts.findOrCreate({
                        where: { hours: 'Vacaciones' },
                        defaults: { hours: 'Vacaciones' }
                    });

                    // 2. Create shifts for each day in range
                    let currentDate = new Date(start);
                    while (currentDate <= end) {
                        const dateStr = currentDate.toISOString().split('T')[0];

                        // Create the shift (PUBLICADO and LOCKED)
                        const [newShift] = await db.shifts.findOrCreate({
                            where: { date: dateStr, idTimeShift: vacaTimeShift.id },
                            defaults: {
                                date: dateStr,
                                idTimeShift: vacaTimeShift.id,
                                state: 'PUBLICADO',
                                locked: true
                            }
                        });

                        // Associate worker with this shift
                        await db.workerShift.findOrCreate({
                            where: { idWorker: request.idWorker, idShift: newShift.id },
                            defaults: { idWorker: request.idWorker, idShift: newShift.id }
                        });

                        currentDate.setDate(currentDate.getDate() + 1);
                    }
                }
            }
        }

        const num = await Request.update(req.body, { where: { id: id } });
        if (num == 1) {
            res.send({ message: "Request was updated successfully!" });
        } else {
            res.send({ message: `Cannot update Request with id=${id}.` });
        }
    } catch (err) {
        console.error("Error updating request and creating shifts:", err);
        res.status(500).send({ message: "Error updating Request with id=" + id });
    }
};

exports.delete = (req, res) => {
    const id = req.params.id;
    Request.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "Request was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Request with id=${id}. Maybe Request was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Request with id=" + id
            });
        });
};



