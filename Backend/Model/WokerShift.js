module.exports = (sequelize, Sequelize) => {
    const workerShift = sequelize.define("workerShift", {
        idWorker: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
            // references: {
            //     model: "worker",
            //     key: "id"
            // }
        },
        idShift: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: "shifts",
                key: "id"
            }
        }
    });

    /*
  *  ---------------------------------------------------------------------------------
  * |                                 RELACIONSHIPS                                   |
  *  ---------------------------------------------------------------------------------
  */


    workerShift.associate = (models) => {
        workerShift.belongsTo(models.worker, {
            foreignKey: "idWorker",
            targetKey: "id",
            as: "worker",
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        workerShift.belongsTo(models.shifts, {
            foreignKey: "idShift",
            targetKey: "id",
            as: "shift",
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    };
    return workerShift;

}