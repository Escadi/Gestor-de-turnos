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

exports.update = (req, res) => {
    const id = req.params.id;

    const abences = {
        typeAbences: req.body.typeAbences,
        timeStart: req.body.timeStart,
        timeEnd: req.body.timeEnd,
        details: req.body.details,
        status: req.body.status
    };

    if (req.file) {
        abences.filename = req.file.filename;
    }

    Abences.update(abences, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: 'Ausencia actualizada correctamente.' });
            } else {
                res.send({ message: `No se pudo actualizar la ausencia con id=${id}.` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Error al actualizar la ausencia.'
            });
        });
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

exports.findAll = (req, res) => {
    const idWorker = req.query.idWorker;
    const role = req.query.role;

    const canViewAll =
        role === rolUser.ADMIN ||
        role === rolUser.SUPERVISOR ||
        role === rolUser.DIRECTOR;

    var condition = canViewAll ? null : (idWorker ? { idWorker: idWorker } : null);

    Abences.findAll({
        where: condition,
        order: [['applicationDate', 'DESC']],
        include: [{
            model: db.worker,
            as: 'worker',
            attributes: ['id', 'name', 'surname']
        }]
    })
        .then(data => res.send(data))
        .catch(err =>
            res.status(500).send({
                message: err.message || 'Error al obtener las ausencias.'
            })
        );
};