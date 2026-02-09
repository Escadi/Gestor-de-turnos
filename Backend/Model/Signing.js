/**
 * MODELO: SIGNING (Fichajes)
 * Registro de entradas y salidas de los trabajadores.
 * Incluye fecha/hora y geolocalización (latitud/longitud).
 */
module.exports = (sequelize, Sequelize) => {
    const signing = sequelize.define("signings", {
        date: {
            type: Sequelize.DATE
        },
        idWorker: {
            type: Sequelize.INTEGER,
        },
        lat: {
            type: Sequelize.FLOAT
        },
        lng: {
            type: Sequelize.FLOAT
        }
    });

    /**
    *  ---------------------------------------------------------------------------------
    * |                                 RELACIONSHIPS                                   |
    *  --------------------------------------------------------------------------------
    **/

    signing.associate = (models) => {
        signing.belongsTo(models.worker, {
            foreignKey: 'idWorker',
            targetKey: 'id',
            as: 'worker',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    }

    return signing;

};