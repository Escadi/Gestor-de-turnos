module.exports = (sequelize, Sequelize) => {
    const nameFuction = sequelize.define("nameFuction", {
        nameCategory: {
            type: Sequelize.STRING
        }
    });

     /**
    *  ---------------------------------------------------------------------------------
    * |                                 RELACIONSHIPS                                   |
    *  ---------------------------------------------------------------------------------
    */

     nameFuction.associate = (models) => {

        //IS GOING TO
        nameFuction.hasMany(models.worker,{
            foreignKey:"idFuction",
            sourceKey:"id",
            as:"nameFuction"
        })
     };
     
    return nameFuction;
    
}