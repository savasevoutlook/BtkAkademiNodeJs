const express = require('express');
const router = express.Router();

const errorController = require('../controllers/errors');

router.get('/unauthorized', errorController.get403Page);

module.exports = router;
