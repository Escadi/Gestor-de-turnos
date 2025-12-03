module.exports = (sequelize, Sequelize) => {
    const requestType = sequelize.define("requestType", {
        typeRequest: {
            type: Sequelize.STRING
        }
    });

    /**
   *  ---------------------------------------------------------------------------------
   * |                                 RELACIONSHIPS                                   |
   *  ---------------------------------------------------------------------------------
   */

    requestType.associate = (models) => {

        //IS GOING TO
        requestType.hasMany(models.request, {
            foreignKey: "idType",
            sourceKey: "id",
            as: "request",
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
    };

    return requestType;
}