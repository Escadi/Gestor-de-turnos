module.exports = (sequelize, Sequelize) => {
    const times = sequelize.define("timesShifts", {
        hours: {
            type: Sequelize.STRING
        }
    });

     /**
    *  ---------------------------------------------------------------------------------
    * |                                 RELACIONSHIPS                                   |
    *  ---------------------------------------------------------------------------------
    */

     times.associate = (models) => {

        //IS GOING TO
        times.hasMany(models.shifts,{
            foreignKey:"idHours",
            sourceKey:"id",
            as:"times"
        })
     };
    return times
    
}