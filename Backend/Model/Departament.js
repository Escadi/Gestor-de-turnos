module.exports = (sequelize, Sequelize) => {
    const Departament = sequelize.define('departament', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,

        }
    });

    /**
   *  ---------------------------------------------------------------------------------
   * |                                 RELACIONSHIPS                                   |
   *  ---------------------------------------------------------------------------------
   */

    // RELACION DEPARTAMENTO - TRABAJADOR LLEVANDOSE ESTA FK PARA WORKER
    Departament.associate = function (models) {
        Departament.hasMany(models.worker, {
            foreignKey: 'idDepartament',
            as: 'worker'
        });
    };


    return Departament;
};