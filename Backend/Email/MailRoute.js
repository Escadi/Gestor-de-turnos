module.exports = (app) => {
    const router = require('express').Router();
    const mailController = require('./MailController');


    router.post('/send-reset-code', mailController.sendResetCode);
    router.post('/verify-reset-code', mailController.verifyResetCode);
    router.put('/reset-password', mailController.resetPassword);

    app.use('/api/mail', router);

}

