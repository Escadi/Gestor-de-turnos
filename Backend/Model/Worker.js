module.exports = (sequelize, Sequelize) => {
    const worker = sequelize.define("worker", {
        name: {
            type: Sequelize.STRING
        },
        surname: {
            type: Sequelize.STRING
        },
        dni: {
            type: Sequelize.STRING
        },
        registrationDate: {
            type: Sequelize.DATE
        },
        phoneNumber: {
            type: Sequelize.STRING
        },
        idFuction: {
            type: Sequelize.INTEGER,
            references: {
                model: 'nameFuction',
                key: 'id'
            }
        },
        locked: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }

    });

    /**
   *  ---------------------------------------------------------------------------------
   * |                                 RELACIONSHIPS                                   |
   *  ---------------------------------------------------------------------------------
   */
    worker.associate = (models) => {
        worker.belongsTo(models.nameFuction, {
            foreignKey: 'idFuction',
            targerKey: 'id',
            as: 'fuction',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        worker.hasMany(models.shifts, {
            foreignKey: 'idWorker',
            as: 'shifts',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        worker.hasMany(models.request, {
            foreignKey: 'idWorker',
            as: 'requests',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        worker.hasOne(models.login, {
            foreignKey: 'idWorker',
            as: 'login',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

    }

    return worker;
}