const express = require('express');
const { register, login, logout, refreshAccessToken, getCurrentUser } = require('../controllers/auth');
const { auth } = require('../utils');
const { registerValidator, loginValidator } = require('../validators/auth');
const { validate } = require('../middlewares/validate');

const router = express.Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/logout', auth(false), logout);
router.post('/refresh-token', refreshAccessToken);
router.get('/me', auth(false), getCurrentUser);

module.exports = router;
