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
        details: req.body.details || null
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
exports.update = (req, res) => {
    const id = req.params.id;
    Request.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num === 1) {
                res.send({
                    message: "Request was updated successfully!"
                });
            } else {
                res.send({
                    message: `Cannot update Request with id=${id}. Maybe Request was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not update Request with id=" + id
            });
        });
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



