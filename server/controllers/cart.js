const Cart = require("../models/Cart");

const getCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        res.status(200).json(cart || { user: req.user._id, items: [] });
    } catch (err) {
        next(err);
    }
};

const updateCart = async (req, res, next) => {
    try {
        const { items } = req.body;
        let cart = await Cart.findOneAndUpdate(
            { user: req.user._id },
            { user: req.user._id, items },
            { upsert: true, new: true }
        );
        res.status(200).json(cart);
    } catch (err) {
        next(err);
    }
};

const deleteCartItem = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const cart = await Cart.findOneAndUpdate(
            { user: req.user._id },
            { $pull: { items: { product: productId } } },
            { new: true }
        ).populate("items.product");

        res.status(200).json(cart);
    } catch (err) {
        next(err);
    }
};

const clearCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            { user: req.user._id },
            { items: [] },
            { new: true }
        ).populate("items.product");

        res.status(200).json(cart);
    } catch (err) {
        next(err);
    }
};

const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity = 1 } = req.body;

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({
                user: req.user._id,
                items: [{ product: productId, quantity }],
            });
        } else {
            const existingItem = cart.items.find((item) =>
                item.product.toString() === productId
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }
        }

        await cart.save();
        await cart.populate("items.product");

        res.status(200).json(cart);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getCart,
    updateCart,
    deleteCartItem,
    clearCart,
    addToCart,
};
