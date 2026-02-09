/**
 * MODELO: SANCTION (Sanciones)
 * Registro de sanciones disciplinarias aplicadas a trabajadores.
 * Incluye motivo, grado y fecha.
 */
module.exports = (sequelize, Sequelize) => {
    const sanction = sequelize.define("sanctions", {
        timeHour: {
            type: Sequelize.STRING
        },
        reason: {
            type: Sequelize.STRING
        },
        grade: {
            type: Sequelize.STRING
        },
        idSanctions: {
            type: Sequelize.INTEGER,
            references: {
                model: "shifts",
                key: "id"
            }
        }
    });

    /**
   *  ---------------------------------------------------------------------------------
   * |                                 RELACIONSHIPS                                   |
   *  ---------------------------------------------------------------------------------
   */

    sanction.associate = (models) => {

        //IS GOING TO
        sanction.belongsTo(models.worker, {
            foreignKey: "idWorker",
            sourceKey: "id",
            as: "worker",
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
    };
    return sanction

}