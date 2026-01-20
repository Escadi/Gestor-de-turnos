module.exports = (app) => {
    const worker = require("../Controller/WorkerController");
    const upload = require("../Middleware/upload");
    const router = require("express").Router();

    router.get("/", worker.findAll);
    router.get("/:id", worker.findOne);
    router.post("/", worker.create);
    router.put("/:id", worker.updateWorker);
    router.delete("/:id", worker.delete);
    router.post("/upload-photo/:id", upload.single('photo'), worker.uploadPhoto);

    app.use("/api/worker", router);
}