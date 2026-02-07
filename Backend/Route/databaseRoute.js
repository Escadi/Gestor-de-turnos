const databaseController = require("../Controller/DatabaseController");

module.exports = (app) => {
    const router = require("express").Router();

    // Route to download backup
    router.get("/download", databaseController.downloadBackup);

    // Route to save backup locally
    router.post("/save-local", databaseController.saveBackupLocally);

    app.use('/api/database', router);
};
