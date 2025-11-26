module.exports= (sequelize, Sequelize) =>{
    const shifts = sequelize.define("shifts", {
        date:{
            type: Sequelize.DATE
        },
        idWorker: {
            type: Sequelize.INTEGER,
        },
        idTimes:{
            type: Sequelize.INTEGER,
        }
    });

    /**
    *  ---------------------------------------------------------------------------------
    * |                                 RELACIONSHIPS                                   |
    *  --------------------------------------------------------------------------------
    **/

    shifts.associate = (models) => {
        shifts.belongsTo(models.worker, {
            foreignKey: 'idWorker',
            targerKey: 'id',
            as: 'worker'
        });
    }
    shifts.associate = (models) => {
        shifts.belongsTo(models.times, {
            foreignKey: 'idTimes',
            targerKey: 'id',
            as: 'times'
        });
    }

    return shifts;

};