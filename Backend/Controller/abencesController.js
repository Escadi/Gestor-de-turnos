const db = require("../Model");
const Abences = db.abences;


exports.findAll = (req, res) => {
    Abences.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al obtener las ausencias."
            });
        });
}