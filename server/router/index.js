const express = require('express');
const router = express.Router();
const auth = require('./auth');
const catalog = require('./catalog');
const admin = require('./admin');
const cart = require('./cart');
const econt = require("./econt");
const speedy = require("./speedy");
const order = require("./order");
const review = require("./review");
const profile = require("./profile");

router.use('/auth', auth)
router.use('/catalog', catalog);
router.use('/admin', admin);
router.use('/cart', cart);
router.use("/econt", econt);
router.use("/speedy", speedy);
router.use("/order", order)
router.use("/review", review)
router.use("/profile", profile)

module.exports = router;