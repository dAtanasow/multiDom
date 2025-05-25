const express = require('express');
const { getCart, deleteCartItem, updateCart, clearCart, addToCart }
    = require('../controllers/cart');
const { auth } = require('../utils');

const router = express.Router();

router.get('/', auth(false), getCart)
router.put('/update', auth(false), updateCart)
router.delete('/clear', auth(false), clearCart);
router.post('/add', auth(false), addToCart);
router.delete('/:productId', auth(false), deleteCartItem)

module.exports = router;
