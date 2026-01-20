module.exports = (app) => {
    const signing = require("../Controller/SigningController.js");

    var router = require("express").Router();

    // Create a new signing
    router.post("/", signing.create);

    // Retrieve all signings
    router.get("/", signing.findAll);

    app.use('/api/signing', router);
}
