/**
 * MODELO: TIMESHIFTS (Tipos de Turno Horario)
 * Define los horarios base disponibles (ej. Mañana 08:00-15:00, Tarde 15:00-22:00).
 * Es el catálogo de turnos asignables.
 */
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