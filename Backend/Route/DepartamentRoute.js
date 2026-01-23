module.exports = (app) => {
    const departamentController = require("../Controller/DepartamentController");
    const router = require("express").Router();

    router.post("/", departamentController.create);
    router.get("/", departamentController.findAll);
    router.put("/:id", departamentController.update);
    router.delete("/:id", departamentController.delete);


    app.use("/api/departament", router);
}