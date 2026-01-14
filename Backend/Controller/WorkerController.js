const db = require("../Model");
const Worker = db.worker;



exports.findAll = (req, res) => {
    Worker.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving workers."
            });
        });
}

exports.findOne = (req, res) => {
    const id = req.params.id;

    Worker.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Worker with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Worker with id=" + id
            });
        });
}

exports.updateWorker = (req, res) => {
    const id = req.params.id;

    Worker.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Worker was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Worker with id=${id}. Maybe Worker was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Worker with id=" + id
            });
        });
}