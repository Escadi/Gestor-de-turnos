const databaseController = require("../Controller/DatabaseController");

/**
 * RUTA: DATABASE (Base de Datos)
 * Endpoints para tareas de mantenimiento como copias de seguridad (backups).
 */
module.exports = (app) => {
    const router = require("express").Router();

    // Route to download backup
    router.get("/download", databaseController.downloadBackup);

    // Route to save backup locally
    router.post("/save-local", databaseController.saveBackupLocally);

    app.use('/api/database', router);
};
