module.exports = (app) => {
    const abencesController = require("../Controller/abencesController");
    const router = require("express").Router();
    const upload = require("../Middleware/upload");


    router.get("/", abencesController.findAll);
    router.post("/", upload.single("file"), abencesController.create);
    router.put("/:id", upload.single("file"), abencesController.update);
    router.delete("/:id", abencesController.delete);



    app.use("/api/abences", router);
}


