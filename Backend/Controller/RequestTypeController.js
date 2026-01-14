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