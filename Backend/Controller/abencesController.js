const db = require("../Model");
const Abences = db.abences;
const rolUser = require("../status/rolUser");


exports.findAll = (req, res) => {
    const idWorker = req.query.idWorker;
    const role = req.query.role;

    // Determinar si el usuario puede ver todas las peticiones
    const canViewAll = role === rolUser.ADMIN ||
        role === rolUser.SUPERVISOR ||
        role === rolUser.DIRECTOR;

    // Si es admin, supervisor o director, no aplicar filtro de trabajador
    // Si es trabajador, solo mostrar sus peticiones
    var condition = canViewAll ? null : (idWorker ? { idWorker: idWorker } : null);

    Abences.findAll({
        where: condition,
        order: [['applicationDate', 'DESC']],
        include: [{
            model: db.worker,
            attributes: ['id', 'name', 'lastName']
        }]
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al obtener las ausencias."
            });
        });
}