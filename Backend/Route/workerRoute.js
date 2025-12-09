module.exports = (app) => {
    const worker = require("../Controller/workerController");
    const router = require("express").Router();

    //router.post("/", worker.createWorker);
    router.get("/", worker.findAll);
    //router.get("/:id", worker.getWorker);
    //router.put("/:id", worker.updateWorker);
    //router.delete("/:id", worker.deleteWorker);

    app.use("/api/worker", router);
}