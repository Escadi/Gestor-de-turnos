module.exports = (sequelize, Sequelize) => {
    const nameFuction = sequelize.define("nameFuction", {
        name: {
            type: Sequelize.STRING,
            field: 'nameCategory' // Mapeamos 'name' en el código a 'nameCategory' en la DB
        },
        accessLevel: {
            type: Sequelize.STRING,
            defaultValue: 'Empleado'
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
        })
    };

    return nameFuction;

}