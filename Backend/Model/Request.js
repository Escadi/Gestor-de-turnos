module.exports = (sequelize, Sequelize) => {
    const request = sequelize.define("request", {
        applicationDate: {
            type: Sequelize.DATE
        },
        status: {
            type: Sequelize.STRING
        },
        details: {
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
                model: 'requestType',
                key: 'id'
            }
        },
        timeStart: {
            type: Sequelize.STRING
        },
        timeEnd: {
            type: Sequelize.STRING
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

        request.belongsTo(models.requestType, {
            foreignKey: "idType",
            targetKey: "id",
            as: "requestType",
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    }

    return request;
}