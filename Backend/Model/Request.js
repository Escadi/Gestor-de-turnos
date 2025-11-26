module.exports = (sequelize, Sequelize) => {
    const request = sequelize.define("request", {
        applicationDate: {
            type: Sequelize.DATE,
        },
        status: {
            type: Sequelize.STRING,
        },
        idWorker: {
            type: Sequelize.INTEGER,
        },
        idType: {
            type: Sequelize.INTEGER,
        }
    });

    /**
    *  ---------------------------------------------------------------------------------
    * |                                 RELACIONSHIPS                                   |
    *  ---------------------------------------------------------------------------------
    */
        request.associate = (models) => {
        request.belongsTo(models.worker,{
            foreignKey:"idWorker",
            targetKey:"id",
            as:"worker"
        });

        request.belongsTo(models.typeRequest,{
            foreignKey:"idType",
            targetKey:"id",
            as:"typeRequest"
        });
    }
    
    return Request;
}