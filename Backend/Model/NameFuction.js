/**
 * MODELO: NAMEFUCTION (Puestos/Categorías)
 * Define los cargos o puestos de trabajo (ej. Director, Supervisor, Empleado).
 * Soporta jerarquía (padre-hijo) para establecer estructura organizativa.
 */
module.exports = (sequelize, Sequelize) => {
    const nameFuction = sequelize.define("nameFuction", {
        name: {
            type: Sequelize.STRING,
            field: 'nameCategory' // Mapeamos 'name' en el código a 'nameCategory' en la DB
        },
        accessLevel: {
            type: Sequelize.STRING,
            defaultValue: 'Empleado'
        },
        parentId: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: null,
            references: {
                model: 'nameFuction',
                key: 'id'
            }
        },
        order: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            comment: 'Orden de visualización en el organigrama'
        }
    });

    /**
   *  ---------------------------------------------------------------------------------
   * |                                 RELACIONSHIPS                                   |
   *  ---------------------------------------------------------------------------------
   */

    nameFuction.associate = (models) => {

        //IS GOING TO
        nameFuction.hasMany(models.worker, {
            foreignKey: "idFuction",
            sourceKey: "id",
            as: "nameFuction",
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        // Relación jerárquica: un rol puede tener subordinados
        nameFuction.hasMany(models.nameFuction, {
            foreignKey: 'parentId',
            as: 'subordinates',
            onDelete: 'SET NULL'
        });

        // Relación jerárquica: un rol puede tener un superior
        nameFuction.belongsTo(models.nameFuction, {
            foreignKey: 'parentId',
            as: 'parent',
            onDelete: 'SET NULL'
        });
    };

    return nameFuction;

}