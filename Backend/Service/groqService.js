const Groq = require("groq-sdk");

// =======================
// CONFIGURACIÓN GROQ
// =======================
if (!process.env.GROQ_API_KEY) {
    throw new Error("No se ha encontrado la API key de Groq");
}

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// =======================
// DEFINICIÓN DE TURNOS (24H)
// =======================
const TURNOS_HORAS = {
    1: { inicio: 8, fin: 16 },  // 08:00 - 16:00
    2: { inicio: 16, fin: 24 },  // 16:00 - 00:00
    3: { inicio: 0, fin: 8 },   // 00:00 - 08:00
    4: { inicio: 12, fin: 20 },  // 12:00 - 20:00
    5: { inicio: 10, fin: 18 },  // 10:00 - 18:00
    6: { inicio: 14, fin: 22 },  // 14:00 - 22:00
    7: { inicio: 18, fin: 26 },  // 18:00 - 02:00 (día siguiente)
    8: null                      // LIBRE
};

// =======================
// VALIDACIÓN DE TURNOS
// =======================
function validarTurnos(turnos, dates) {
    for (const workerId in turnos) {
        const dias = turnos[workerId];

        // 1️⃣ Todas las fechas
        if (Object.keys(dias).length !== dates.length) {
            return false;
        }

        const valores = dates.map(d => dias[d]);

        // 2️⃣ 5 trabajados + 2 libres
        const libres = valores.filter(v => v === 8).length;
        const trabajados = valores.length - libres;

        if (libres !== 2 || trabajados !== 5) {
            return false;
        }

        // 5️⃣ Evitar turno único toda la semana
        const turnosTrabajados = valores.filter(v => v !== 8);
        const distintos = new Set(turnosTrabajados);

        if (distintos.size < 2) {
            return false; // todos los días el mismo turno
        }

        // 3️⃣ Libres consecutivos
        let consecutivos = false;
        for (let i = 0; i < valores.length - 1; i++) {
            if (valores[i] === 8 && valores[i + 1] === 8) {
                consecutivos = true;
                break;
            }
        }

        if (!consecutivos) {
            return false;
        }

        // 4️⃣ Descanso mínimo 12 horas
        for (let i = 0; i < valores.length - 1; i++) {
            const hoy = valores[i];
            const manana = valores[i + 1];

            if (hoy === 8 || manana === 8) continue;

            const finHoy = TURNOS_HORAS[hoy].fin;
            const inicioManana = TURNOS_HORAS[manana].inicio;

            const descanso = (inicioManana + 24) - finHoy;

            if (descanso < 12) {
                return false;
            }
        }
    }

    return true;
}

// =======================
// SERVICIO PRINCIPAL
// =======================
exports.generateShifts = async (workers, timeShifts, dates) => {
    try {
        const availableWorkers = workers.filter(w => !w.locked);
        const lockedWorkers = workers.filter(w => w.locked);

        const prompt = `
Eres un asistente experto en planificación de turnos laborales conforme al Estatuto de los Trabajadores español.
Responde ÚNICAMENTE con un JSON válido.

TRABAJADORES DISPONIBLES:
${availableWorkers.map(w => `- ID: ${w.id}, ${w.name} ${w.surname}`).join('\n')}

TRABAJADORES BLOQUEADOS (NO INCLUIR):
${lockedWorkers.length ? lockedWorkers.map(w => `- ID: ${w.id}`).join('\n') : 'Ninguno'}

TURNOS DISPONIBLES:
${timeShifts.map(t => `- ID ${t.id}: ${t.hours}`).join('\n')}

IMPORTANTE:
- El turno con ID 8 es LIBRE.

FECHAS:
${dates.map(d => `- ${d}`).join('\n')}

REGLAS:
1. Genera turnos para TODOS los trabajadores disponibles.
2. Usa SOLO los IDs proporcionados.
3. Usa TODAS las fechas (${dates.length}).
4. Cada trabajador debe tener:
   - 5 días trabajados
   - 2 días libres consecutivos (ID 8)
5. Respeta un descanso mínimo legal de 12 horas entre turnos.
6. Un trabajador NO puede tener el mismo turno en todos sus días trabajados.
7. Cada trabajador debe tener al menos 2 tipos de turnos distintos durante la semana.
8. Un trabajador no puede repetir el mismo turno más de 3 días en la semana.

FORMATO:
{
  "turnos": {
    "workerId": {
      "YYYY-MM-DD": turnoId
    }
  }
}

Genera SOLO el JSON.
`;

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

        const raw = completion.choices[0]?.message?.content || "{}";
        const match = raw.match(/\{[\s\S]*\}/);
        const parsed = JSON.parse(match ? match[0] : "{}");

        const esValido = validarTurnos(parsed.turnos || {}, dates);

        if (!esValido) {
            return {
                success: false,
                turnos: {}
            };
        }

        return {
            success: true,
            turnos: parsed.turnos
        };

    } catch (error) {
        console.error("❌ Error Groq Service:", error);
        return {
            success: false,
            turnos: {}
        };
    }
};