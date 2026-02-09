/**
 * RUTA: REQUEST (Solicitudes)
 * API para gestionar las peticiones de los empleados (vacaciones, cambios, etc).
 */
module.exports = app => {
    const request = require("../Controller/RequestController");
    const router = require("express").Router();


    router.get("/", request.findAll);
    router.post("/", request.create);
    router.delete("/:id", request.delete);
    router.put("/:id", request.update);


    app.use("/api/request", router);
};