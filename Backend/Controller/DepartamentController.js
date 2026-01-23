const db = require("../Model");
const Departament = db.departament;


exports.create = (req, res) => {
    const departamentData = {
        name: req.body.name
    };

    Departament.create(departamentData)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al crear el departamento."
            });
        });
}

exports.findAll = (req, res) => {
    Departament.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error al obtener los departamentos."
            });
        });
}

exports.update = (req, res) => {
    const id = req.params.id;

    Departament.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Departamento actualizado correctamente."
                });
            } else {
                res.send({
                    message: `No se pudo actualizar el departamento con id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al actualizar el departamento con id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Departament.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Departamento eliminado correctamente."
                });
            } else {
                res.send({
                    message: `No se pudo eliminar el departamento con id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al eliminar el departamento con id=" + id
            });
        });
};
