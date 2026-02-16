const db = require("../Model");
const Shift = db.shifts;
const TimeShift = db.timeShifts;
const WorkerShift = db.workerShift;
const Worker = db.worker;


/**
 * ---------------------------------------------------------------
 * CREATE SHIFT
 * ---------------------------------------------------------------
 */

/**
 * Crea un turno individual.
 * Frontend: shifts.page.ts
 */
exports.create = (req, res) => {

    const shift = {
        date: req.body.date,
        idTimeShift: req.body.idTimeShift,
        state: req.body.state || 'BORRADOR',
        locked: req.body.locked || false
    };

    Shift.create(shift)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the shift."
            });
        });
};

/**
 * ---------------------------------------------------------------
 * BULK CREATE SHIFTS (FOR BETTER PERFORMANCE)
 * ---------------------------------------------------------------
 */


/**
 * Crea múltiples turnos de forma masiva y optimizada.
 * Utiliza transacciones para asegurar la integridad de datos.
 * Frontend: shifts.page.ts (Botón 'Generar Turnos')
 */
exports.bulkCreate = async (req, res) => {


    console.log('Bulk create request received');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    // VALIDATE THE REQUEST WHIT CONSOLE LOGS
    if (!req.body.shifts || !Array.isArray(req.body.shifts)) {
        console.log('❌ Validation failed: shifts array is missing or not an array');
        res.status(400).send({
            message: "Shifts array is required!"
        });
        return;
    }

    console.log(`📊 Received ${req.body.shifts.length} shifts to create`);

    // Validate each shift has required fields
    const shiftsData = req.body.shifts.map((shift, index) => {
        if (!shift.date || !shift.idTimeShift || !shift.workerId) {
            console.log(`❌ Shift ${index} is missing required fields:`, shift);
        }
        return {
            shiftData: {
                date: shift.date,
                idTimeShift: shift.idTimeShift,
                state: shift.state || 'BORRADOR',
                locked: shift.locked || false
            },
            workerId: shift.workerId
        };
    });

    console.log('Shifts validated, attempting bulk create with worker associations...');

    try {
        // Use transaction to ensure data consistency
        const result = await db.sequelize.transaction(async (t) => {
            // 1. Create all shifts
            const createdShifts = await Shift.bulkCreate(
                shiftsData.map(s => s.shiftData),
                { transaction: t }
            );

            console.log(`✅ Created ${createdShifts.length} shifts`);

            // 2. Create worker-shift associations
            const workerShiftAssociations = createdShifts.map((shift, index) => ({
                idWorker: shiftsData[index].workerId,
                idShift: shift.id
            }));

            const createdAssociations = await WorkerShift.bulkCreate(
                workerShiftAssociations,
                { transaction: t }
            );

            console.log(`✅ Created ${createdAssociations.length} worker-shift associations`);

            return { shifts: createdShifts, associations: createdAssociations };
        });

        console.log(`✅ Successfully created ${result.shifts.length} shifts with associations`);
        res.send({
            message: `${result.shifts.length} shifts were created successfully with worker associations.`,
            count: result.shifts.length,
            shifts: result.shifts
        });
    } catch (err) {
        console.error('❌ Error creating shifts:', err);
        console.error('Error details:', err.message);
        console.error('Error stack:', err.stack);
        res.status(500).send({
            message: err.message || "Some error occurred while creating shifts.",
            error: err.toString()
        });
    }
};

/**
 * ---------------------------------------------------------------
 * FIND ALL SHIFTS
 * ---------------------------------------------------------------
 */

/**
 * Obtiene turnos con filtros opcionales (fecha, estado, bloqueo).
 * Frontend: shifts.page.ts, show-shifts.page.ts
 */
exports.findAll = (req, res) => {
    const date = req.query.date;
    const locked = req.query.locked;
    const state = req.query.state;
    const idWorker = req.query.idWorker;

    let condition = {};
    if (date) condition.date = date;
    if (locked !== undefined) condition.locked = locked;
    if (state) condition.state = state;

    // Build include options dynamically
    const workerShiftInclude = {
        model: WorkerShift,
        as: 'workerShifts',
        include: [{
            model: Worker,
            as: 'worker'
        }]
    };

    // If idWorker filter is requested, add where clause to the include (Inner Join behavior)
    if (idWorker) {
        workerShiftInclude.where = { idWorker: idWorker };
    }

    Shift.findAll({
        where: Object.keys(condition).length > 0 ? condition : null,
        include: [
            {
                model: TimeShift,
                as: 'timeShift'
            },
            workerShiftInclude
        ],
        order: [['date', 'DESC']]
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving shifts."
            });
        });
};

/**
 * ---------------------------------------------------------------
 * UPDATE SHIFT
 * ---------------------------------------------------------------
 */

/**
 * Actualiza la información de un turno existente.
 * Frontend: shifts.page.ts
 */
exports.update = (req, res) => {
    const id = req.params.id;

    Shift.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Shift was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Shift with id=${id}. Maybe Shift was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Shift with id=" + id
            });
        });
};

// Publish multiple shifts (change state from BORRADOR to PUBLICADO)
/**
 * Publica un conjunto de turnos (cambia estado a 'PUBLICADO').
 * Frontend: shifts.page.ts
 */
exports.publishShifts = (req, res) => {
    const { shiftIds, dates } = req.body;

    let condition = {};

    // If specific shift IDs are provided, use them
    if (shiftIds && shiftIds.length > 0) {
        condition.id = shiftIds;
    }
    // If dates are provided, publish all draft shifts for those dates
    else if (dates && dates.length > 0) {
        condition.date = dates;
        condition.state = 'BORRADOR';
    }
    // Otherwise, publish all draft shifts
    else {
        condition.state = 'BORRADOR';
    }

    Shift.update(
        { state: 'PUBLICADO' },
        { where: condition }
    )
        .then(num => {
            res.send({
                message: `${num} shift(s) were published successfully.`,
                count: num
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while publishing shifts."
            });
        });
};


/**
  *  -------------------------------------------------------------------------------------
  *  PARTE DE WORKER-SHIFT                         
  *  -------------------------------------------------------------------------------------
  */

/**
 * Obtiene los turnos asignados a un trabajador específico.
 * Incluye solo turnos PUBLICADOS.
 * Frontend: worker-schedule.page.ts
 */
exports.findAllWorkerShifts = (req, res) => {
    const workerId = req.params.workerId;
    WorkerShift.findAll({
        where: { idWorker: workerId },
        include: [
            {
                model: Shift,
                as: 'shift',
                where: { state: 'PUBLICADO' }, // Only include published shifts
                include: [
                    {
                        model: TimeShift,
                        as: 'timeShift' // Include the time shift details (hours, type, etc.)
                    }
                ]
            }
        ]
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving worker-shifts."
            });
        });
};
