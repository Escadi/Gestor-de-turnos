module.exports = (app) => {
    const shifts = require("../Controller/ShiftController.js");
    const router = require("express").Router();

    // Create a new Shift
    router.post("/", shifts.create);

    // Retrieve all Shifts
    router.get("/", shifts.findAll);

    app.use("/api/shifts", router);
};
