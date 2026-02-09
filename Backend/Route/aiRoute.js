/**
 * RUTA: AI (Inteligencia Artificial)
 * Endpoints para interactuar con servicios de IA (Generación de turnos).
 */
module.exports = (app) => {
    const ai = require("../Controller/aiController");
    const router = require("express").Router();

    // Ruta para generar turnos con IA
    router.post("/generate-shifts", ai.generateShifts);

    app.use("/api/ai", router);
}
