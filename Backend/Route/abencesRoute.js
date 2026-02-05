module.exports = (app) => {
    const abencesController = require("../Controller/abencesController");
    const router = require("express").Router();
    const upload = require("../Middleware/upload");


    router.get("/", abencesController.findAll);
    router.post("/", upload.single("file"), abencesController.create);



    app.use("/api/abences", router);
}


