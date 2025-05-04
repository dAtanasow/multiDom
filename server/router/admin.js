const express = require('express');
const router = express.Router();
const { auth } = require('../utils');
const { createProduct } = require('../controllers/admin');

router.post('/', auth(), createProduct);


module.exports = router;