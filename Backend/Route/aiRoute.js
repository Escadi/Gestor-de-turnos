module.exports = (app) => {
    const ai = require("../Controller/aiController");
    const router = require("express").Router();

    router.post("/generate-shifts", ai.generateShifts);

    app.use("/api/ai", router);
}
