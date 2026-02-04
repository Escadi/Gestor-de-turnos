module.exports = (app) => {
    const abencesController = require("../Controller/abencesController");
    const router = require("express").Router();


    router.get("/", abencesController.findAll);



    app.use("/api/abences", router);
}


