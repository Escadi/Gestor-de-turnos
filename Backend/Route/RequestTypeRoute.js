module.exports = app => {
    const requestType = require("../Controller/RequestTypeController");
    const router = require("express").Router();

    router.get("/", requestType.findAll);

    app.use("/api/requestTypes", router);
};