const express = require('express');
const router = express.Router();
const auth = require('./auth');
const catalog = require('./catalog');
const admin = require('./admin');
const cart = require('./cart');

router.use('/auth', auth)
router.use('/catalog', catalog);
router.use('/admin', admin);
router.use('/cart', cart);

module.exports = router;
