const express = require('express');
const router = express.Router();
const { auth } = require('../utils');
const { createProduct, updateProduct, deleteProduct }
    = require('../controllers/admin');
const { isAdmin } = require('../utils/isAdmin');

router.post('/create', auth(), isAdmin, createProduct);
router.put('/update/:id', auth(), isAdmin, updateProduct)
router.delete('/delete/:id', auth(), isAdmin, deleteProduct)

module.exports = router;