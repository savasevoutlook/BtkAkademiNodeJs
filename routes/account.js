const express = require('express');
const router = express.Router();

const accountController = require('../controllers/account');


router.get('/login', accountController.getLogin);

router.get('/reset-password', accountController.getResetPassword);

router.get('/logout', accountController.getLogout);

router.get('/register', accountController.getRegister);


router.post('/login', accountController.postLogin);

router.post('/register', accountController.postRegister);

router.post('/reset-password', accountController.postResetPassword);


module.exports = router;
