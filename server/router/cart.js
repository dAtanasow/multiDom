const express = require('express');
const { getCart, deleteCartItem, updateCart, clearCart } = require('../controllers/cart');

const router = express.Router();

router.get('/', getCart)
router.put('/', updateCart)
router.delete('/', clearCart);
router.delete('/:productId', deleteCartItem)


module.exports = router;
