const express = require('express');
const { getCart, deleteCartItem, updateCart, clearCart, addToCart } = require('../controllers/cart');

const router = express.Router();

router.get('/', getCart)
router.put('/', updateCart)
router.delete('/', clearCart);
router.post('/add', addToCart); 
router.delete('/:productId', deleteCartItem)

module.exports = router;
