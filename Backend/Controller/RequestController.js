const db = require("../Model");
const Request = db.request;
const rolUser = require("../status/rolUser");


exports.create = (req, res) => {
    // Validate request
    if (!req.body.idWorker) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Request
    const request = {
        applicationDate: req.body.applicationDate || new Date(),
        status: req.body.status,
        idWorker: req.body.idWorker,
        idType: req.body.idType
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

exports.findAll = (req, res) => {
    const idWorker = req.query.idWorker;
    const role = req.query.role;

    // Determinar si el usuario puede ver todas las peticiones
    const canViewAll = role === rolUser.ADMIN ||
        role === rolUser.SUPERVISOR ||
        role === rolUser.DIRECTOR;

    // Si es admin, supervisor o director, no aplicar filtro de trabajador
    // Si es trabajador, solo mostrar sus peticiones
    var condition = canViewAll ? null : (idWorker ? { idWorker: idWorker } : null);

    Request.findAll({
        where: condition,
        order: [['applicationDate', 'DESC']],
        include: [{
            model: db.worker,
            as: 'worker',
            attributes: ['id', 'name', 'surname']
        }]
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving requests."
            });
        });
};



