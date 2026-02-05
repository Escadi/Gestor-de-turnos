module.exports = app => {
    const request = require("../Controller/RequestController");
    const router = require("express").Router();


    router.get("/", request.findAll);
    router.post("/", request.create);


    app.use("/api/request", router);
};