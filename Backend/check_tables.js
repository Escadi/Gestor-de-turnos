/**
 * SCRIPT: CHECK TABLES
 * Muestra el listado de todas las tablas existentes en la base de datos.
 * Útil para depuración y verificar migraciones.
 */
const db = require('./Model');

async function listTables() {
    try {
        console.log('🔍 Consultando tablas en la base de datos...');
        const [results] = await db.sequelize.query("SHOW TABLES");
        console.log('Tablas encontradas:');
        results.forEach(row => {
            console.log(Object.values(row)[0]);
        });
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await db.sequelize.close();
    }
}

listTables();
