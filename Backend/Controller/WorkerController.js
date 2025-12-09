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