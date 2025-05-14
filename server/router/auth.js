const express = require('express');
const { register, login, logout, editProfile, refreshAccessToken } = require('../controllers/auth');
const { auth } = require('../utils');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', auth(false), logout);
router.post('/refresh-token', refreshAccessToken);

module.exports = router;
