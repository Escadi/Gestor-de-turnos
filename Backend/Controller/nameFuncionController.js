const db = require("../Model");
const NameFuncion = db.nameFuction;

exports.findAll = (req, res) => {
    NameFuncion.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving nameFuncion."
            });
        });
}


exports.findOne = (req, res) => {
    const id = req.params.id;
    NameFuncion.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find nameFuncion with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving nameFuncion with id=" + id
            });
        });
}