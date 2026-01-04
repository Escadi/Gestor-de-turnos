const db = require("../Model");
const Shift = db.shifts;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.idWorker) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Shift
    const shift = {
        date: req.body.date || new Date(),
        idWorker: req.body.idWorker,
        idTimes: req.body.idTimes, // Optional?
        lat: req.body.lat,
        lng: req.body.lng
    };

    // Save Shift in the database
    Shift.create(shift)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Shift."
            });
        });
};

exports.findAll = (req, res) => {
    Shift.findAll()
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
