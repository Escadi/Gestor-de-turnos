const bcrypt = require('bcryptjs');

/**
 * MODELO: LOGIN
 * Almacena las credenciales de acceso (usuario y contraseña encriptada) y el rol del sistema.
 * Está vinculado 1:1 con el modelo Worker.
 */
module.exports = (sequelize, Sequelize) => {
    const login = sequelize.define("login", {
        idWorker: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            references: {
                model: 'worker',
                key: 'id'
            }
        },
        username: {
            type: Sequelize.STRING,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            set(value) {
                // Encriptar la contraseña antes de guardarla
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(value, salt);
                this.setDataValue('password', hash);
            }
        },
        role: {
            type: Sequelize.STRING
        }
    });

    // Método para verificar la contraseña
    login.prototype.validPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };

    /**
    *  ---------------------------------------------------------------------------------
    * |                                 RELACIONSHIPS                                   |
    *  ---------------------------------------------------------------------------------
    */

    login.associate = (models) => {
        login.belongsTo(models.worker, {
            foreignKey: 'idWorker',
            targetKey: 'id',
            as: 'worker',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    }

    return login;
}