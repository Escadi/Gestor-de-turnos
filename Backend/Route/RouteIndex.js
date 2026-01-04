module.exports = (app) => {

    require("./workerRoute")(app);
    require("./timeShiftRoute")(app);
    require("./nameFuncionRoute")(app);
    require("./shiftRoute")(app);

}