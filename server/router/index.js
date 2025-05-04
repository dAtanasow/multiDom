const express = require('express');
const router = express.Router();
const auth = require('./auth');
const catalog = require('./catalog');
const admin = require('./admin');

router.use('/auth', auth)
router.use('/catalog', catalog);
router.use('/admin', admin);


module.exports = router;
