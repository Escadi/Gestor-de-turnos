/**
 * MODELO: STATUS (Estado del Trabajador)
 * Define los posibles estados de un trabajador (Activo, Baja, Vacaciones, etc.).
 */
module.exports = (sequelize, Sequelize) => {
    const status = sequelize.define("status", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING
        }
    });

    /**
     *  ---------------------------------------------------------------------------------
     * |                                 RELACIONSHIPS                                   |
     *  ---------------------------------------------------------------------------------
     */


    status.associate = (models) => {
        status.hasMany(models.worker, {
            foreignKey: 'idStatus',
            as: 'workers',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

    }

    return status;



}