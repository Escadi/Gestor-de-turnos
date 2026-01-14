const db = require("../Model");
const RequestType = db.requestType;



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