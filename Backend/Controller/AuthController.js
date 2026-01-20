const db = require("../Model");
const Login = db.login;
const Worker = db.worker;
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    const { idWorker, password } = req.body;

    try {
        const user = await Login.findOne({
            where: { idWorker: idWorker },
            include: [{
                model: Worker,
                as: 'worker'
            }]
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

        const token = jwt.sign({ id: user.idWorker, role: user.role }, "secret-key", {
            expiresIn: 86400 // 24 horas
        });

        res.status(200).send({
            idWorker: user.idWorker,
            role: user.role,
            name: user.worker ? user.worker.name : 'Usuario',
            surname: user.worker ? user.worker.surname : '',
            accessToken: token
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
