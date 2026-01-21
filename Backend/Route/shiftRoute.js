module.exports = (app) => {
    const shifts = require("../Controller/ShiftController.js");
    const router = require("express").Router();

    // Create a new Shift
    router.post("/", shifts.create);

    // Bulk create shifts
    router.post("/bulk", shifts.bulkCreate);

    // Retrieve all Shifts
    router.get("/", shifts.findAll);

    // Update a shift by ID
    router.put("/:id", shifts.update);

    // Publish multiple shifts
    router.put("/", shifts.publishShifts);

    // Retrieve all workerShifts
    router.get("/workerShifts/:workerId", shifts.findAllWorkerShifts);

    app.use("/api/shifts", router);
};
