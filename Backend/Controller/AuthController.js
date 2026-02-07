const db = require("../Model");
const Login = db.login;
const Worker = db.worker;
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    const { idWorker, password } = req.body;

    try {
        // 1. Buscar usuario básico (SIN INCLUDES COMPLEJOS QUE PUEDAN FALLAR)
        const user = await Login.findOne({
            where: { idWorker: idWorker },
            include: [{ model: Worker, as: 'worker' }]
        });

        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        }

        const passwordIsValid = user.validPassword(password);

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Contraseña incorrecta."
            });
        }

        // 2. Obtener el rol real de forma SEGURA y separada
        let realRole = 'Empleado'; // Valor por defecto seguro

        if (user.worker && user.worker.idFuction) {
            try {
                const funcion = await db.nameFuction.findByPk(user.worker.idFuction);
                if (funcion && funcion.accessLevel) {
                    realRole = funcion.accessLevel;
                }
            } catch (roleError) {
                console.warn("No se pudo obtener el rol jerárquico, usando por defecto:", roleError);
            }
        }

        const token = jwt.sign({ id: user.idWorker, role: realRole }, "secret-key", {
            expiresIn: 86400 // 24 horas
        });

        res.status(200).send({
            idWorker: user.idWorker,
            role: realRole,
            name: user.worker ? user.worker.name : 'Usuario',
            surname: user.worker ? user.worker.surname : '',
            accessToken: token
        });

    } catch (err) {
        console.error("Login Critical Error:", err);
        res.status(500).send({ message: err.message });
    }
};
