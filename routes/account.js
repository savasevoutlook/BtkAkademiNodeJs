const express = require('express');
const router = express.Router();

const csrfTokenMiddleware = require('../middleware/csrf-token-middleware');
const { doubleCsrfProtection } = require('../utility/csrf');

const accountController = require('../controllers/account');


router.get('/login', csrfTokenMiddleware, accountController.getLogin);

router.post('/login', doubleCsrfProtection, accountController.postLogin);

router.get('/logout', accountController.getLogout);

router.get('/register', csrfTokenMiddleware, accountController.getRegister);

router.post('/register', doubleCsrfProtection, accountController.postRegister);

router.get('/reset-password', csrfTokenMiddleware, accountController.getResetPassword);

router.post('/reset-password', doubleCsrfProtection, accountController.postResetPassword);

router.get('/reset/:token', csrfTokenMiddleware, accountController.getNewPassword);

router.post('/new-password', doubleCsrfProtection, accountController.postNewPassword);

module.exports = router;
