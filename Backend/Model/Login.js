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
        password: {
            type: Sequelize.STRING
        },
        role: {
            type: Sequelize.STRING
        }
    });

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