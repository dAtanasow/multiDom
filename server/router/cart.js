const express = require('express');
const { getCart, deleteCartItem, updateCart, clearCart, addToCart }
    = require('../controllers/cart');
const { auth } = require('../utils');

const router = express.Router();

router.get('/', auth(), getCart)
router.put('/', auth(), updateCart)
router.delete('/', auth(), clearCart);
router.post('/add', auth(), addToCart);
router.delete('/:productId', auth(), deleteCartItem)

module.exports = router;
