const groqService = require("../Service/groqService");

/**
 * Endpoint para generar turnos con IA
 */
exports.generateShifts = async (req, res) => {
    try {
        const { workers, timeShifts, dates } = req.body;

        // Validar datos de entrada
        if (!workers || !Array.isArray(workers) || workers.length === 0) {
            return res.status(400).send({
                success: false,
                message: "Se requiere una lista de trabajadores válida"
            });
        }

        if (!timeShifts || !Array.isArray(timeShifts) || timeShifts.length === 0) {
            return res.status(400).send({
                success: false,
                message: "Se requiere una lista de tipos de turnos válida"
            });
        }

        if (!dates || !Array.isArray(dates) || dates.length === 0) {
            return res.status(400).send({
                success: false,
                message: "Se requiere una lista de fechas válida"
            });
        }

        // Llamar al servicio de Groq
        const result = await groqService.generateShifts(workers, timeShifts, dates);

        if (result.success) {
            res.send(result);
        } else {
            res.status(500).send(result);
        }

    } catch (error) {
        console.error("Error en aiController:", error);
        res.status(500).send({
            success: false,
            message: error.message || "Error al generar turnos con IA"
        });
    }
};
