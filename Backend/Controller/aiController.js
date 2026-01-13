const groqService = require("../Service/groqService");

exports.generateShifts = async (req, res) => {
    try {
        const { workers, timeShifts, dates } = req.body;

        /**
         *  -------------------------------------------------------------------------------------
         * |           VALIDACIÓN DE DATOS DE ENTRADA DE CADA UNO DE LOS DATOS                   |
         *  -------------------------------------------------------------------------------------
         */
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

        /**
         *  -------------------------------------------------------------------------------------
         * |                            LLAMADA AL SERVICIO DE GROQ IA                           |
         *  -------------------------------------------------------------------------------------
         */
        const result = await groqService.generateShifts(workers, timeShifts, dates);

        /**
         *  -------------------------------------------------------------------------------------
         * |                    VALIDACIÓN DE LA RESPUESTA DEL SERVICIO DE GROQ IA               |
         *  -------------------------------------------------------------------------------------
         */
        if (result.success) {
            res.send(result);
        } else {
            res.status(500).send({
                success: false,
                message: result.error || "Error al generar turnos con IA",
                detalles: result.detalles
            });
        }

    } catch (error) {
        console.error("❌ Error crítico en aiController:", error);
        res.status(500).send({
            success: false,
            message: error.message || "Error al generar turnos con IA",
            error: error.toString()
        });
    }
};
