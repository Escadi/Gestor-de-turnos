module.exports = (sequelize, Sequelize) => {
    const abences = sequelize.define("abences", {
        typeAbences: {
            type: Sequelize.STRING
        },
        timeStart: {
            type: Sequelize.STRING
        },
        timeEnd: {
            type: Sequelize.STRING
        },
        details: {
            type: Sequelize.STRING
        }

    });

    /**
   *  ---------------------------------------------------------------------------------
   * |                                 RELACIONSHIPS                                   |
   *  ---------------------------------------------------------------------------------
   */

    abences.associate = (models) => {

        //IS GOING TO
        abences.belongsTo(models.worker, {
            foreignKey: "idWorker",
            sourceKey: "id",
            as: "worker",
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
    };
    return abences

}