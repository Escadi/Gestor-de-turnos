const db = require("../Model");
const TimeShifts = db.timeShifts;


/**
 * Obtiene los tipos de turno base (horarios predefinidos).
 * Frontend: shifts.page.ts
 */
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