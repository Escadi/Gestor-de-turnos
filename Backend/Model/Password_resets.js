/**
 * MODELO: PASSWORD_RESETS (Recuperación de Contraseña con codigo de verificación )
 * Almacena el correo electrónico, el código de recuperación y la fecha de expiración.
 */

module.exports = (sequelize, Sequelize) => {

    const password_resets = sequelize.define("password_resets", {
        email: {
            type: Sequelize.STRING
        },
        code: {
            type: Sequelize.STRING
        },
        expires_at: {
            type: Sequelize.DATE
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    })

    return password_resets;
}