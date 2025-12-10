module.exports = (app) => {
    const timeShift = require('../Controller/TimeShiftController');
    const router = require("express").Router();


    router.get("/", timeShift.findAll);



    app.use("/api/timeshift", router);

};

