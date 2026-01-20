const db = require("../Model");
const Signing = db.signing;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.idWorker) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a signing
    const signing = {
        date: req.body.date || new Date(),
        idWorker: req.body.idWorker,
        lat: req.body.lat,
        lng: req.body.lng
    };

    // Save signing in the database
    Signing.create(signing)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the signing."
            });
        });
};

exports.findAll = (req, res) => {
    const idWorker = req.query.idWorker;
    var condition = idWorker ? { idWorker: idWorker } : null;

    Signing.findAll({ where: condition, order: [['date', 'DESC']] })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving shifts."
            });
        });
};
