const Groq = require("groq-sdk");

// Inicializar cliente de Groq con API key
if (!process.env.GROQ_API_KEY) {
    throw new Error("No se ha encontrado la API key de Groq");
}

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

/**
 * Genera turnos automáticamente usando Groq AI
 * @param {Array} workers - Lista de trabajadores con sus datos
 * @param {Array} timeShifts - Tipos de turnos disponibles
 * @param {Array} dates - Fechas de la semana
 * @returns {Promise<Object>} - Objeto con turnos generados por trabajador y fecha
 */
exports.generateShifts = async (workers, timeShifts, dates) => {
    try {
        // Filtrar trabajadores no bloqueados
        const availableWorkers = workers.filter(w => !w.locked);
        const lockedWorkers = workers.filter(w => w.locked);

        // Construir el prompt para la IA
        const prompt = `Eres un asistente experto en gestión de turnos de trabajo. 

TRABAJADORES DISPONIBLES (no bloqueados):
${availableWorkers.map(w => `- ID: ${w.id}, Nombre: ${w.name} ${w.surname}, Función: ${w.idFuction}`).join('\n')}

TRABAJADORES BLOQUEADOS (NO modificar sus turnos):
${lockedWorkers.length > 0 ? lockedWorkers.map(w => `- ID: ${w.id}, Nombre: ${w.name} ${w.surname}`).join('\n') : 'Ninguno'}

TIPOS DE TURNOS DISPONIBLES:
${timeShifts.map(t => `- ID: ${t.id}, Horario: ${t.hours}`).join('\n')}

FECHAS DE LA SEMANA:
${dates.map((d, i) => `- Día ${i + 1}: ${d}`).join('\n')}

INSTRUCCIONES:
1. Genera una distribución de turnos SOLO para los trabajadores disponibles (no bloqueados)
2. Asigna turnos de forma equitativa y balanceada
3. Evita asignar el mismo turno a una persona más de 2 días consecutivos
4. Asegura cobertura para todos los días de la semana
5. Considera las funciones de los trabajadores para una distribución lógica
6. NO incluyas a los trabajadores bloqueados en la respuesta

FORMATO DE RESPUESTA (JSON estricto, sin texto adicional):
{
  "turnos": {
    "1": {
      "2024-01-15": 1,
      "2024-01-16": 2
    },
    "2": {
      "2024-01-15": 3
    }
  }
}

Donde las claves son IDs de trabajadores y los valores son objetos con fechas como claves e IDs de turnos como valores.

Genera SOLO el JSON, sin explicaciones adicionales.`;

        // Llamar a Groq AI
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `Eres un asistente experto en planificación de turnos laborales conforme al Estatuto de los Trabajadores español.

TURNOS DISPONIBLES (usa SOLO estos IDs):
1 = 08:00 - 16:00
2 = 16:00 - 00:00
3 = 00:00 - 08:00
4 = 12:00 - 20:00
5 = 10:00 - 18:00
6 = 14:00 - 22:00
7 = 18:00 - 02:00
8 = LIBRE (descanso)

REGLAS CRÍTICAS (OBLIGATORIAS):
1. Usa SOLO los IDs de trabajadores proporcionados.
2. Usa SOLO los IDs de turnos proporcionados.
3. Genera turnos para TODOS los trabajadores NO bloqueados proporcionados, sin excepción.
4. Las fechas proporcionadas son EXACTAMENTE 7 y deben usarse TODAS.
5. Cada trabajador debe tener EXACTAMENTE 7 asignaciones (una por cada fecha).
6. Cada trabajador debe tener EXACTAMENTE:
   - 5 días trabajados (IDs 1–7)
   - 2 días de descanso (ID 8)
7. Los 2 días de descanso (ID 8) deben ser CONSECUTIVOS.
8. No incluyas trabajadores bloqueados.
9. Asegura una distribución equitativa de turnos entre los trabajadores.

REGLA LEGAL DE DESCANSO:
10. Debe existir un descanso mínimo de 12 horas entre el final de un turno y el inicio del siguiente.
11. No asignes combinaciones de turnos que incumplan esta regla.
   Ejemplos PROHIBIDOS:
   - Turno 7 (18:00–02:00) seguido de turno 1 (08:00–16:00)
   - Turno 3 (00:00–08:00) seguido de turno 1 (08:00–16:00)

VALIDACIÓN FINAL OBLIGATORIA:
13. Antes de responder, verifica que PARA CADA trabajador:
    - Hay exactamente 7 fechas
    - Hay exactamente 5 turnos trabajados
    - Hay exactamente 2 ID 8 consecutivos
    - No hay violaciones del descanso mínimo legal

Devuelve SOLO el JSON final.`

                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.1, // Menor temperatura para mayor consistencia en JSON
            max_completion_tokens: 4096, // Aumentado por si hay muchos trabajadores
            response_format: { "type": "json_object" } // Forzar respuesta JSON
        });

        // Extraer respuesta
        const responseText = chatCompletion.choices[0]?.message?.content || "{}";

        // Limpiar la respuesta de forma robusta
        let cleanedResponse = responseText.trim();

        // Intentar extraer solo lo que esté entre las llaves más externas si hay texto extra
        const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            cleanedResponse = jsonMatch[0];
        }

        // Parsear JSON
        const result = JSON.parse(cleanedResponse);

        return {
            success: true,
            turnos: result.turnos || {},
            message: "Turnos generados exitosamente con IA"
        };


    } catch (error) {
        console.error("Error en Groq AI:", error);
        return {
            success: false,
            turnos: {},
            message: error.message || "Error al generar turnos con IA"
        };
    }
};
