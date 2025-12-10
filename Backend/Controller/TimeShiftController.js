const db = require("../Model");
const TimeShifts = db.timeShifts;


exports.findAll = (req, res) => {
    TimeShifts.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving timeShifts."
            });
        });
};