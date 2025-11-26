module.exports = (sequelize, Sequelize) => {
    const request = sequelize.define("request", {
        applicationDate: {
            type: Sequelize.DATE
        },
        status: {
            type: Sequelize.STRING
        },
        idWorker: {
            type: Sequelize.INTEGER,
            references: {
                model: 'worker',
                key: 'id'
            }
        },
        idType: {
            type: Sequelize.INTEGER,
            references: {
                model: 'typeRequest',
                key: 'id'
            }
        }
    });

    /**
    *  ---------------------------------------------------------------------------------
    * |                                 RELACIONSHIPS                                   |
    *  ---------------------------------------------------------------------------------
    */
    request.associate = (models) => {
        request.belongsTo(models.worker, {
            foreignKey: "idWorker",
            targetKey: "id",
            as: "worker",
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        request.belongsTo(models.typeRequest, {
            foreignKey: "idType",
            targetKey: "id",
            as: "typeRequest",
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    }

    return Request;
}