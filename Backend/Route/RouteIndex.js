/**
 * RUTA: ÍNDICE PRINCIPAL
 * Agrupa e inicializa tadas las rutas de la aplicación.
 * Es el punto de entrada para la configuración de endpoints en Express.
 */
module.exports = (app) => {

    require("./authRoute")(app);
    require("./workerRoute")(app);
    require("./timeShiftRoute")(app);
    require("./nameFuncionRoute")(app);
    require("./shiftRoute")(app);
    require("./aiRoute")(app);
    require("./RequestRoute")(app);
    require("./RequestTypeRoute")(app);
    require("./signingRoute")(app);
    require("./abencesRoute")(app);
    require("./databaseRoute")(app);
    require("./pdf-csvRoute")(app);

}