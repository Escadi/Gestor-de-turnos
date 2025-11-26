module.exports = (sequelize, Sequelize) => {
    const shifts = sequelize.define("shifts", {
        date: {
            type: Sequelize.DATE
        },
        idWorker: {
            type: Sequelize.INTEGER,
        },
        idTimes: {
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
            as: 'worker',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        shifts.belongsTo(models.times, {
            foreignKey: 'idTimes',
            targerKey: 'id',
            as: 'times',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    }

    return shifts;

};