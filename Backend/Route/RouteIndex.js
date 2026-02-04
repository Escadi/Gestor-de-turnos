module.exports = (app) => {

    require("./authRoute")(app);
    require("./workerRoute")(app);
    require("./timeShiftRoute")(app);
    require("./nameFuncionRoute")(app);
    require("./shiftRoute")(app);
    require("./aiRoute")(app);
    require("./DepartamentRoute")(app);
    require("./RequestRoute")(app);
    require("./RequestTypeRoute")(app);
    require("./signingRoute")(app);
    require("./abencesRoute")(app);

}