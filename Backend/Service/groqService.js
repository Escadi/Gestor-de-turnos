const Groq = require("groq-sdk");


if (!process.env.GROQ_API_KEY) {
    throw new Error("No se ha encontrado la API key de Groq");
}
/**
 *  -------------------------------------------------------------------------------------
 * |                INICIAMOS GROQ SDK CON LA API KEY QUE ESTA EN .ENV                   |
 *  -------------------------------------------------------------------------------------
 */
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

console.log("----- | Groq SDK inicializado correctamente |------");

/**
 *  -------------------------------------------------------------------------------------
 * | DEFINICIÓN DE TURNOS COMO (24H)                                                          |
 *  -------------------------------------------------------------------------------------
 */
const TURNOS_HORAS = {
    1: { inicio: 8, fin: 16 }, 
    2: { inicio: 16, fin: 24 },  
    3: { inicio: 0, fin: 8 },   
    4: { inicio: 12, fin: 20 }, 
    5: { inicio: 10, fin: 18 }, 
    6: { inicio: 14, fin: 22 }, 
    7: { inicio: 18, fin: 26 }, 
    8: null        //LIBRE              
};

/**
 *  -------------------------------------------------------------------------------------
 * | REALIZACIÓN DE UNA VALIDACIÓN DE TURNOS GENERADOS POR LA IA SIMPLE PARA COMPROBAR |
 * | QUE SE HAN GENERADO TURNOS PARA TODOS LOS TRABAJADORES EN TODAS LAS FECHAS         |
 *  ---------------------------------------------------------------------------------
 */
/**
 * Valida que los turnos generados por la IA sean coherentes.
 * Comprueba que se hayan generado turnos para todos los trabajadores y fechas solicitadas.
 * Uso: Interno en generateShifts
 */
function validarTurnos(turnos, dates) {
    console.log("\n Validando turnos generados (modo simplificado)...");


    // VERIFICAMOS QUE SE HAN GENERADO TURNOS
    if (!turnos || Object.keys(turnos).length === 0) {
        console.log("No se generaron turnos");
        return { valido: false, errores: ["No se generaron turnos"] };
    }

    let advertencias = [];

    for (const workerId in turnos) {
        const dias = turnos[workerId];

        // VERIFICAMOS QUE TENGA TODAS LAS FECHAS
        if (Object.keys(dias).length !== dates.length) {
            advertencias.push(`Worker ${workerId}: Tiene ${Object.keys(dias).length} días asignados, se esperan ${dates.length}`);
        }

    }

    // VERIFICAMOS QUE SE HAN GENERADO TURNOS PARA TODOS LOS TRABAJADORES EN TODAS LAS FECHAS
    if (advertencias.length > 0) {
        console.log(`\nAdvertencias (no bloquean):\n${advertencias.join("\n")}`);
    }

    console.log("Validación básica completada - Los turnos se pueden ajustar manualmente\n");
    return { valido: true, errores: [], advertencias };
}

/**
 *  -------------------------------------------------------------------------------------
 * | GENERACIÓN DE TURNOS CON IA CON GROQ , REALIZA LA LLAMADA CON LA API Y ME REALIZA   |
 * | EL PROMPT CON LA INFORMACIÓN DE LOS TRABAJADORES, TURNOS Y FECHAS Y ME DEVUELVE     |
 * | UN JSON CON LOS TURNOS GENERADOS                                                    |
 *  ---------------------------------------------------------------------------------
 */
/**
 * Solicita a la IA (Groq/Llama3) la generación de un cuadrante de turnos.
 * Construye el prompt con las restricciones y parsea la respuesta JSON.
 * Controller: aiController.js
 */
exports.generateShifts = async (workers, timeShifts, dates) => {
    const MAX_INTENTOS = 1;

    for (let intento = 1; intento <= MAX_INTENTOS; intento++) {
        try {
            console.log(`GROQ AI Creando turnos- Intento ${intento} / de ${MAX_INTENTOS}`);

            const availableWorkers = workers.filter(w => !w.locked);
            const lockedWorkers = workers.filter(w => w.locked);

            const prompt = `
Eres un asistente para planificación de turnos laborales.
Responde ÚNICAMENTE con un JSON válido.

TRABAJADORES DISPONIBLES:
${availableWorkers.map(w => `- ID: ${w.id}, ${w.name} ${w.surname}`).join('\n')}

TRABAJADORES BLOQUEADOS (NO INCLUIR):
${lockedWorkers.length ? lockedWorkers.map(w => `- ID: ${w.id}`).join('\n') : 'Ninguno'}

TURNOS DISPONIBLES:
${timeShifts.map(t => `- ID ${t.id}: ${t.hours}`).join('\n')}

IMPORTANTE:
- El turno con ID 8 es LIBRE (día de descanso).

FECHAS:
${dates.map(d => `- ${d}`).join('\n')}

REGLAS BÁSICAS:
1. Genera turnos para TODOS los trabajadores disponibles.
2. Usa SOLO los IDs de turnos proporcionados.
3. Asigna un turno para cada trabajador en TODAS las fechas (${dates.length} fechas).
4. Intenta distribuir los turnos de forma equilibrada.
5. Usa el turno ID 8 para días libres.
6. El turno ID 8 tiene que realizar 2 seguidos en todas las fechas.

FORMATO DE RESPUESTA:
{
  "turnos": {
    "workerId": {
      "YYYY-MM-DD": turnoId
    }
  }
}

Genera SOLO el JSON, sin explicaciones adicionales.
`;

            console.log("\nEnviando solicitud a Groq AI...");

            const completion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: "Devuelve exclusivamente JSON válido." },
                    { role: "user", content: prompt }
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.1,
                max_completion_tokens: 4096,
                response_format: { type: "json_object" }
            });

            console.log("Respuesta recibida de Groq AI");

            const raw = completion.choices[0]?.message?.content || "{}";

            const match = raw.match(/\{[\s\S]*\}/);
            const parsed = JSON.parse(match ? match[0] : "{}");

            if (!parsed.turnos || Object.keys(parsed.turnos).length === 0) {
                console.log("La IA no generó turnos. Reintentando...");
                continue;
            }

            const validacion = validarTurnos(parsed.turnos || {}, dates);

            if (!validacion.valido) {
                console.log(`Validación fallida en intento ${intento}. ${validacion.errores.length} errores encontrados.`);
                if (intento < MAX_INTENTOS) {
                    console.log("Reintentando con la IA...");
                    continue;
                } else {
                    return {
                        success: false,
                        turnos: {},
                        error: "No se pudo generar una planificación válida después de varios intentos",
                        detalles: validacion.errores
                    };
                }
            }

            console.log(`Turnos generados y validados correctamente en intento ${intento}`);

            return {
                success: true,
                turnos: parsed.turnos
            };

        } catch (error) {
            console.error(`Error en intento ${intento}:`, error.message);

            if (intento === MAX_INTENTOS) {
                console.error("Error Groq Service (todos los intentos fallaron):", error);
                return {
                    success: false,
                    turnos: {},
                    error: error.message || "Error al generar turnos con IA",
                    detalles: error.stack
                };
            }

            console.log("Reintentando...");
        }
    }

    return {
        success: false,
        turnos: {},
        error: "No se pudo generar turnos después de varios intentos"
    };
};
