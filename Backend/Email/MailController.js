const transporter = require('./Nodemailer');
const db = require('../Model');
const bcrypt = require('bcryptjs');
const { worker: Worker, login: Login, password_resets: PasswordResets } = db;
const { Op } = require("sequelize");

/**
 * -------------------------------------------------------------------------------------------------
 * ENVÍA UN CÓDIGO DE RECUPERACIÓN AL CORREO ELECTRÓNICO DEL USUARIO.
 * -------------------------------------------------------------------------------------------------
 */

module.exports.sendResetCode = async (req, res) => {
    // RECIBIMOS idWorker EN LUGAR DE EMAIL DIRECTAMENTE
    const { idWorker } = req.body;

    // Validación básica
    if (!idWorker) {
        return res.status(400).json({ success: false, message: 'Falta el ID del empleado.' });
    }

    const otp = generateOTP();

    try {
        // 1. BUscamos el trabajador por idWorker para obtener su email
        const workerFound = await Worker.findByPk(idWorker);

        if (!workerFound) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
        }

        const email = workerFound.email;

        if (!email) {
            return res.status(400).json({ success: false, message: 'El usuario no tiene un correo electrónico registrado.' });
        }
        /*
        ------------------------------------------------------------------------------------------------------------------------------------------------
         2. Guardar código con expiración 5 minutos
         Usamos el modelo PasswordResets o query directa. Usaremos query directa para mantener consistencia con lo anterior si no se cargó el modelo, 
         pero idealmente deberíamos usar el modelo. Dado que vamos a registrar el modelo, intentemos usarlo o fallback.
         Mantenemos la query raw por si acaso el modelo da problemas, o actualizamos a Sequelize si el modelo está bien definido.
         La implementación anterior usaba db.query. Vamos a usar db.sequelize.query para raw queries si preferimos, o el modelo.
         Al ver el archivo Password_resets.js, es un modelo de Sequelize. Usémoslo.
        ------------------------------------------------------------------------------------------------------------------------------------------------
        */

        // Borramos códigos anteriores para este email
        await PasswordResets.destroy({
            where: { email: email }
        });

        // Creamos el nuevo registro
        const expiresAt = new Date(new Date().getTime() + 5 * 60000); // 5 minutos
        await PasswordResets.create({
            email: email,
            code: otp.toString(),
            expires_at: expiresAt
        });

        /*
        ------------------------------------------------------------------------------------------------------------------------------------------------
         3. ENVIAMOS EL EMAIL
        ------------------------------------------------------------------------------------------------------------------------------------------------
        */
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Código de recuperación - Gestor de Turnos',
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #2563eb;">Recuperación de contraseña</h2>
            <p>Hola <strong>${workerFound.name}</strong>,</p>
            <p>Has solicitado restablecer tu contraseña. Tu código de verificación es:</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <h1 style="color: #2563eb; letter-spacing: 5px; margin: 0;">${otp}</h1>
            </div>
            <p>Este código expira en 5 minutos.</p>
            <p style="font-size: 12px; color: #6b7280;">Si no has solicitado este código, por favor ignora este correo.</p>
        </div>
      `
        });

        res.json({ success: true, message: 'Código enviado correctamente al correo registrado.' });

    } catch (error) {
        console.error("Error al enviar código:", error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
};

/**
 * -------------------------------------------------------------------------------------------------
 * GENERA UN CÓDIGO DE RECUPERACIÓN DE FORMA ALEATORIA
 * -------------------------------------------------------------------------------------------------
 */
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

/**
 * -------------------------------------------------------------------------------------------------
 * VERIFICA UN CÓDIGO DE RECUPERACIÓN PARA HACER LA RECUPERACIÓN DE LA CONTRASEÑA
 * -------------------------------------------------------------------------------------------------
 */
module.exports.verifyResetCode = async (req, res) => {
    const { idWorker, code } = req.body;

    if (!idWorker || !code) {
        return res.status(400).json({ success: false, message: 'Datos incompletos.' });
    }

    try {
        // 1. Obtener email del worker
        const workerFound = await Worker.findByPk(idWorker);
        if (!workerFound) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
        }
        const email = workerFound.email;

        // 2. Verificar código
        const resetEntry = await PasswordResets.findOne({
            where: {
                email: email,
                code: code,
                expires_at: {
                    [Op.gt]: new Date() // Expira > Ahora
                }
            }
        });

        if (!resetEntry) {
            return res.status(400).json({ success: false, message: 'Código inválido o expirado.' });
        }

        res.json({ success: true, message: 'Código verificado correctamente.' });

    } catch (error) {
        console.error("Error verificando código:", error);
        res.status(500).json({ success: false, message: 'Error verificando el código.' });
    }
};

/**
 * -------------------------------------------------------------------------------------------------
 * CAMBIO DE CONTRASEÑA DESPUES DE HABER VERIFICADO EL CORREO ELECTRONICO
 * -------------------------------------------------------------------------------------------------
 */
module.exports.resetPassword = async (req, res) => {
    const { idWorker, password } = req.body;

    if (!idWorker || !password) {
        return res.status(400).json({ success: false, message: 'Datos incompletos.' });
    }

    try {
        const workerFound = await Worker.findByPk(idWorker);
        if (!workerFound) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
        }

        // Hashear password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Actualizar Login.idWorker
        // Nota: idWorker es la PK de la tabla login según Login.js
        const loginEntry = await Login.findByPk(idWorker);

        if (loginEntry) {
            loginEntry.password = hashPassword; // El setter del modelo podría hashearlo de nuevo si no tenemos cuidado, pero en Login.js el setter usa bcrypt.hashSync.
            // Si pasamos el hash directo y el setter lo vuelve a hashear, es un problema.
            // Miremos Login.js:
            // password: { type: Sequelize.STRING, set(value) { ... const hash = bcrypt.hashSync(value, salt); ... } }
            // Entonces SI pasamos el texto plano 'password', el modelo lo hasheará automáticamente.
            // Así que pasaremos la password en plano al update.

            // Sin embargo, si usamos update con where, el hook/setter a veces no se dispara dependiendo de la versión/config de Sequelize.
            // Pero si instanciamos y guardamos, sí.

            // Opción A: Usar instance.update({ password: password }) -> Invoca setter.
            await loginEntry.update({ password: password });
        } else {
            // Si no tiene login (raro), lo creamos? No, error.
            return res.status(404).json({ success: false, message: 'Registro de login no encontrado.' });
        }

        // Borrar códigos de reset usados
        await PasswordResets.destroy({ where: { email: workerFound.email } });

        res.json({ success: true, message: 'Contraseña actualizada correctamente.' });

    } catch (error) {
        console.error("Error cambiando contraseña:", error);
        res.status(500).json({ success: false, message: 'Error interno al actualizar la contraseña.' });
    }
};