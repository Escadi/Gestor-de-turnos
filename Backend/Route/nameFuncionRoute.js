module.exports = (app) => {
    const nameFuncionController = require("../Controller/nameFuncionController");
    const router = require("express").Router();



    router.get("/", nameFuncionController.findAll);
    router.get("/:id", nameFuncionController.findOne);


    app.use("/api/nameFuncion", router);
}