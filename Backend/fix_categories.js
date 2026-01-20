const db = require("./Model"); // Cambiado para ser relativo al archivo en Backend/

async function fixCategoriesTable() {
    try {
        const queryInterface = db.sequelize.getQueryInterface();
        const tableInfo = await queryInterface.describeTable('nameFuction');

        if (!tableInfo.accessLevel) {
            console.log("Añadiendo columna 'accessLevel' a la tabla 'nameFuction'...");
            await queryInterface.addColumn('nameFuction', 'accessLevel', {
                type: db.Sequelize.STRING,
                defaultValue: 'Empleado',
                allowNull: false
            });
            console.log("Columna añadida con éxito.");
        } else {
            console.log("La columna 'accessLevel' ya existe.");
        }

        process.exit(0);
    } catch (error) {
        console.error("Error al actualizar la tabla:", error);
        process.exit(1);
    }
}

fixCategoriesTable();
