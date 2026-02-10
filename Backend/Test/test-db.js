/**
 * SCRIPT: TEST DB (RESET)
 * ! PELIGRO: Borra y recrea todas las tablas (Force Sync).
 * Utilizar solo en entorno de desarrollo para reiniciar la DB.
 */
const db = require('../Model');

db.sequelize.sync({ force: true })
    .then(() => {
        console.log("✅ Database synced successfully!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Error syncing database:");
        console.error(error);
        process.exit(1);
    });
