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
        },
        status: {
            type: Sequelize.STRING,
        },
        applicationDate: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        idWorker: {
            type: Sequelize.INTEGER,
            references: {
                model: 'worker',
                key: 'id'
            }
        },
        filename: {
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
    return abences;

}