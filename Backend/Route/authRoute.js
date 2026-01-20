module.exports = (app) => {
    const auth = require("../Controller/AuthController");
    const router = require("express").Router();

    router.post("/login", auth.login);

    app.use("/api/auth", router);
};
