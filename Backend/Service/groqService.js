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
                    content: "Eres un asistente que genera turnos de trabajo semanales para una empresa en formato JSON y respondes ÚNICAMENTE con JSON válido sin texto adicional, debes generar los turnos para todos los trabajadores cumpliendo que cada trabajador tenga los 7 días de la semana definidos, un ciclo de 5 días trabajados y 2 días libres, un descanso mínimo de 12 horas entre días trabajados, exactamente 3 turnos de 08:00 a 16:00 y exactamente 2 turnos de 16:00 a 00:00 por trabajador, siendo los otros 2 días libres, sin repetir los mismos trabajadores en los mismos horarios en un mismo día, con un máximo de 9 trabajadores trabajando por día, permitiendo variación en los horarios del resto de trabajadores siempre que se respeten todas las reglas y que el JSON incluya el identificador del trabajador, el día de la semana, el tipo de día y el horario si corresponde."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile", // Modelo rápido y eficiente
            temperature: 0.7,
            max_completion_tokens: 2048,
            top_p: 1,
            stream: false
        });

        // Extraer respuesta
        const responseText = chatCompletion.choices[0]?.message?.content || "{}";

        // Limpiar la respuesta (remover markdown si existe)
        let cleanedResponse = responseText.trim();
        if (cleanedResponse.startsWith('```json')) {
            cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (cleanedResponse.startsWith('```')) {
            cleanedResponse = cleanedResponse.replace(/```\n?/g, '');
        }

        // Parsear JSON
        const result = JSON.parse(cleanedResponse);

        //return {
        //    success: true,
        //    turnos: result.turnos || {},
        //    message: "Turnos generados exitosamente con IA"
        //};

        return result;

    } catch (error) {
        console.error("Error en Groq AI:", error);
        return {
            success: false,
            turnos: {},
            message: error.message || "Error al generar turnos con IA"
        };
    }
};
