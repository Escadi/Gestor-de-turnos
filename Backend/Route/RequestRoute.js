module.exports = app => {
    const request = require("../Controller/RequestController");
    const router = require("express").Router();


    router.get("/", request.findAll);
    router.post("/", request.create);
    router.delete("/:id", request.delete);
    router.put("/:id", request.update);


    app.use("/api/request", router);
};