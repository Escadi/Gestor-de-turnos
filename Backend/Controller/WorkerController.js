const db = require("../Model");
const Worker = db.worker;
const Login = db.login;

const getDescendantFunctions = async (parentId, nameFuctionModel) => {
    const children = await nameFuctionModel.findAll({ where: { parentId: parentId } });
    let descendantIds = children.map(c => c.id);
    for (const child of children) {
        const nestedIds = await getDescendantFunctions(child.id, nameFuctionModel);
        descendantIds = descendantIds.concat(nestedIds);
    }
    return descendantIds;
};

/**
 * Obtiene la lista de trabajadores.
 * Filtra por managerId si se proporciona para mostrar solo subordinados.
 * Frontend: my-workers.page.ts, workers-details-crud.page.ts
 */
exports.findAll = async (req, res) => {
    const managerId = req.query.managerId;

    try {
        let condition = {};

        if (managerId) {
            // 1. Encontrar el trabajador actual (manager)
            const manager = await Worker.findByPk(managerId);
            if (!manager) {
                return res.status(404).send({ message: "Manager no encontrado." });
            }

            // 2. Encontrar todas las funciones subordinadas recursivamente
            const descendantFunctionIds = await getDescendantFunctions(manager.idFuction, db.nameFuction);

            // 3. Filtrar trabajadores que tengan esas funciones
            condition.idFuction = descendantFunctionIds;
        }

        const data = await Worker.findAll({
            where: condition,
            include: [
                { model: db.nameFuction, as: 'fuction' },
                { model: db.status, as: 'status' }
            ]
        });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving workers."
        });
    }
}

/**
 * Obtiene datos detallados de un trabajador.
 * Frontend: worker-profile.page.ts, workers-details-crud.page.ts
 */
exports.findOne = (req, res) => {
    const id = req.params.id;

    Worker.findByPk(id, {
        include: [
            { model: db.nameFuction, as: 'fuction' },
            { model: db.status, as: 'status' }
        ]
    })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Worker with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Worker with id=" + id
            });
        });
}

/**
 * Crea un nuevo trabajador y su usuario de login asociado.
 * Frontend: workers-details-crud.page.ts
 */
exports.create = async (req, res) => {
    // Validate request
    if (!req.body.name || !req.body.dni) {
        return res.status(400).send({ message: "Nombre y DNI son obligatorios." });
    }

    try {
        const workerData = {
            name: req.body.name,
            surname: req.body.surname,
            dni: req.body.dni,
            idFuction: req.body.idFuction,
            idStatus: req.body.idStatus || 1,
            locked: req.body.locked || false,
            imageUrl: req.body.imageUrl || null,
            registrationDate: new Date()
        };

        const worker = await Worker.create(workerData);

        // Si se proporciona contraseña, crear el login
        if (req.body.password) {
            await Login.create({
                idWorker: worker.id,
                username: req.body.username || null,
                password: req.body.password,
                role: req.body.role || 'user'
            });
        }

        res.send(worker);
    } catch (err) {
        res.status(500).send({ message: err.message || "Error al crear el trabajador." });
    }
};

/**
 * Actualiza un trabajador existente y sus credenciales.
 * Frontend: workers-details-crud.page.ts
 */
exports.updateWorker = async (req, res) => {
    const id = req.params.id;

    try {
        // 1. Actualizar datos del trabajador
        const [num] = await Worker.update(req.body, {
            where: { id: id }
        });

        // 2. Si hay contraseña o rol, gestionar tabla Login
        if (req.body.password || req.body.role) {
            const loginData = {
                idWorker: id,
                role: req.body.role || 'user'
            };
            if (req.body.password) loginData.password = req.body.password;
            if (req.body.username) loginData.username = req.body.username;

            const existingLogin = await Login.findOne({ where: { idWorker: id } });

            if (existingLogin) {
                await Login.update(loginData, { where: { idWorker: id } });
            } else {
                // Si no existía login (caso del worker 1), lo creamos
                if (!req.body.password) {
                    // Si no mandó pass pero queremos crear login, ponemos una por defecto (DNI)
                    const worker = await Worker.findByPk(id);
                    loginData.password = worker.dni;
                }
                await Login.create(loginData);
            }
        }

        res.send({ message: "Trabajador y credenciales actualizados correctamente." });
    } catch (err) {
        res.status(500).send({
            message: "Error actualizando trabajador con id=" + id + ". " + err.message
        });
    }
}

/**
 * Elimina un trabajador.
 * Frontend: workers-details-crud.page.ts
 */
exports.delete = (req, res) => {
    const id = req.params.id;

    Worker.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Trabajador eliminado correctamente." });
            } else {
                res.send({ message: `No se pudo eliminar el trabajador con id=${id}.` });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error al eliminar el trabajador." });
        });
};

/**
 * Sube y actualiza la foto de perfil del trabajador.
 * Frontend: worker-profile.page.ts
 */
exports.uploadPhoto = (req, res) => {
    const id = req.params.id;

    if (!req.file) {
        return res.status(400).send({ message: "Por favor, sube un archivo." });
    }

    const host = req.get('host');
    const imageUrl = `${req.protocol}://${host}/uploads/${req.file.filename}`;

    Worker.update({ imageUrl: imageUrl }, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Foto subida correctamente.",
                    imageUrl: imageUrl
                });
            } else {
                res.status(404).send({
                    message: `No se pudo actualizar la foto del trabajador con id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error al guardar la ruta de la imagen."
            });
        });
};