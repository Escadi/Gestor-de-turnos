module.exports = app => {
    const request = require("../Controller/RequestController");
    const router = require("express").Router();


    router.get("/", request.findAll);


    app.use("/api/request", router);
};