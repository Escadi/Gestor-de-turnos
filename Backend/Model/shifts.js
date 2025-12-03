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
            targetKey: 'id',
            as: 'worker',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        shifts.belongsTo(models.timeShifts, {
            foreignKey: 'idTimes',
            targetKey: 'id',
            as: 'timeShifts',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    }

    return shifts;

};