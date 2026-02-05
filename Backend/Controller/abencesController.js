const db = require("../Model");
const Abences = db.abences;
const rolUser = require("../status/rolUser");


exports.create = (req, res) => {

    const abences = {
        idWorker: req.body.idWorker,
        timeStart: req.body.timeStart,
        timeEnd: req.body.timeEnd,
        applicationDate: req.body.applicationDate,
        filename: req.file.filename,
        details: req.body.details,
        status: req.body.status
    };

    Abences.create(abences)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || 'Error al crear la ausencia.'
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