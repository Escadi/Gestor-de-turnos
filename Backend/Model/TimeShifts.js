module.exports = (sequelize, Sequelize) => {
    const timeShifts = sequelize.define("timeShifts", {
        hours: {
            type: Sequelize.STRING
        }
    });

    /**
   *  ---------------------------------------------------------------------------------
   * |                                 RELACIONSHIPS                                   |
   *  ---------------------------------------------------------------------------------
   */

    timeShifts.associate = (models) => {

        //IS GOING TO
        timeShifts.hasMany(models.shifts, {
            foreignKey: "idTimes",
            sourceKey: "id",
            as: "shifts",
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
    };

    return timeShifts;
}