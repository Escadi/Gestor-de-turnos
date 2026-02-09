const db = require("../Model");
const NameFuncion = db.nameFuction;

/**
 * Obtiene todas las categorías laborales.
 * Frontend: settings.page.ts, workers-details-crud.page.ts
 */
exports.findAll = (req, res) => {
    NameFuncion.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving nameFuncion."
            });
        });
}

exports.findOne = (req, res) => {
    const id = req.params.id;
    NameFuncion.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find nameFuncion with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving nameFuncion with id=" + id
            });
        });
}

/**
 * Crea una nueva categoría laboral.
 * Frontend: settings.page.ts
 */
exports.create = (req, res) => {
    if (!req.body.name) {
        return res.status(400).send({ message: "El nombre no puede estar vacío." });
    }

    const categoryData = {
        name: req.body.name,
        accessLevel: req.body.accessLevel || 'Empleado',
        parentId: req.body.parentId || null
    };

    NameFuncion.create(categoryData)
        .then(data => res.send(data))
        .catch(err => res.status(500).send({ message: err.message || "Error al crear la categoría." }));
};

/**
 * Actualiza una categoría existente.
 * Frontend: settings.page.ts
 */
exports.update = (req, res) => {
    const id = req.params.id;

    // Si mandan 'name', Sequelize lo mapeará a 'nameCategory' gracias al modelo
    NameFuncion.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) res.send({ message: "Categoría actualizada correctamente." });
            else res.send({ message: `No se pudo actualizar la categoría con id=${id}.` });
        })
        .catch(err => res.status(500).send({ message: "Error al actualizar la categoría." }));
};

/**
 * Elimina una categoría laboral.
 * Frontend: settings.page.ts
 */
exports.delete = (req, res) => {
    const id = req.params.id;
    NameFuncion.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) res.send({ message: "Categoría eliminada correctamente." });
            else res.send({ message: `No se pudo eliminar la categoría con id=${id}.` });
        })
        .catch(err => res.status(500).send({ message: "Error al eliminar la categoría." }));
};