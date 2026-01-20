const db = require("./Model");

async function addUsernameColumn() {
    try {
        console.log("Conectando con la base de datos...");
        await db.sequelize.authenticate();

        const queryInterface = db.sequelize.getQueryInterface();
        const tableDefinition = await queryInterface.describeTable('login');

        if (!tableDefinition.username) {
            console.log("Añadiendo columna 'username' a la tabla login...");
            await db.sequelize.query("ALTER TABLE login ADD COLUMN username VARCHAR(255) UNIQUE AFTER idWorker;");
            console.log("Columna añadida.");
        } else {
            console.log("La columna 'username' ya existe.");
        }

    } catch (err) {
        console.error("Error al añadir la columna username:", err);
    } finally {
        await db.sequelize.close();
        process.exit();
    }
}

addUsernameColumn();
