const express = require('express');
const router = express.Router();
const { auth } = require('../utils');
const { createProduct, updateProduct, deleteProduct }
    = require('../controllers/admin');

router.post('/create', auth(), createProduct);
router.put('/update/:id', auth(), updateProduct)
router.delete('/delete/:id', auth(), deleteProduct)

module.exports = router;