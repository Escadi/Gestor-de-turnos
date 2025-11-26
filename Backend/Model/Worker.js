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
    }

    return worker;
}