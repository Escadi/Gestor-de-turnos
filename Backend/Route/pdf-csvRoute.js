module.exports = (app) => {
    const pdf = require("../Controller/Pdf-CSVController");
    const router = require("express").Router();

    router.post("/", pdf.generatePdf);
    router.post("/puppeteer", pdf.generatePdfWithPuppeteer);

    app.use("/api/pdf", router);
};