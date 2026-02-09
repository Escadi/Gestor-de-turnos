const db = require("../Model");
const RequestType = db.requestType;



/**
 * Obtiene todos los tipos de solicitud disponibles.
 * Frontend: request-worker.page.ts
 */
exports.findAll = (req, res) => {
    RequestType.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving request types."
            });
        });
};

/**
 * Obtiene un tipo de solicitud específico por ID.
 * Frontend: request-details.page.ts
 */
exports.findOne = (req, res) => {
    const id = req.params.id;

    RequestType.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find RequestType with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving RequestType with id=" + id
            });
        });
};