const db = require("./Model");

async function fixSchema() {
    try {
        console.log("Conectando con la base de datos para actualizar el esquema...");
        await db.sequelize.authenticate();

        const queryInterface = db.sequelize.getQueryInterface();
        const tableDefinition = await queryInterface.describeTable('worker');

        // Check and add 'idStatus'
        if (!tableDefinition.idStatus) {
            console.log("Añadiendo columna 'idStatus'...");
            await db.sequelize.query("ALTER TABLE worker ADD COLUMN idStatus INT AFTER idFuction;");
        }

        // Check and add 'locked'
        if (!tableDefinition.locked) {
            console.log("Añadiendo columna 'locked'...");
            await db.sequelize.query("ALTER TABLE worker ADD COLUMN locked BOOLEAN DEFAULT FALSE;");
        }

        // Check and add 'imageUrl'
        if (!tableDefinition.imageUrl) {
            console.log("Añadiendo columna 'imageUrl'...");
            await db.sequelize.query("ALTER TABLE worker ADD COLUMN imageUrl VARCHAR(255);");
        }

        console.log("Esquema actualizado correctamente.");

    } catch (err) {
        console.error("Error al actualizar el esquema:", err);
    } finally {
        await db.sequelize.close();
        process.exit();
    }
}

fixSchema();
