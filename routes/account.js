const express = require('express');
const router = express.Router();

const csrfTokenMiddleware = require('../middleware/csrfTokenMiddleware');
const { doubleCsrfProtection } = require('../utility/csrf');

const accountController = require('../controllers/account');


router.get('/login', csrfTokenMiddleware, accountController.getLogin);

router.get('/reset-password', csrfTokenMiddleware, accountController.getResetPassword);

router.get('/logout', accountController.getLogout);

router.get('/register', csrfTokenMiddleware, accountController.getRegister);


router.post('/login', doubleCsrfProtection, accountController.postLogin);

router.post('/register', doubleCsrfProtection, accountController.postRegister);

router.post('/reset-password', doubleCsrfProtection, accountController.postResetPassword);


module.exports = router;
