module.exports = (app) => {
    const nameFuncionController = require("../Controller/nameFuncionController");
    const router = require("express").Router();

    router.get("/", nameFuncionController.findAll);
    router.get("/:id", nameFuncionController.findOne);
    router.post("/", nameFuncionController.create);
    router.put("/:id", nameFuncionController.update);
    router.delete("/:id", nameFuncionController.delete);

    app.use("/api/nameFuncion", router);
}