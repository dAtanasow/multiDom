const { default: mongoose } = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

        if (!cart) {
            return res.status(200).json({ user: req.user._id, items: [] });
        }

        const cleanedItems = cart.items.filter(item => item.product !== null);
        if (cleanedItems.length !== cart.items.length) {
            cart.items = cleanedItems;
            await cart.save();
        }

        res.status(200).json(cart);
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
        const userId = req.user._id;
        const { productId, quantity = 1 } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return next(new CustomError("Невалидно ID на продукт", 400));
        }

        const product = await Product.findById(productId);
        if (!product) {
            return next(new CustomError("Продуктът не съществува", 404));
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [{ product: productId, quantity }],
            });
        } else {
            const existingItem = cart.items.find((item) =>
                item.product.toString() === productId
            );

            if (existingItem) {
                existingItem.quantity = Math.max(existingItem.quantity, quantity); // ✅ избягва дубли
            } else {
                cart.items.push({ product: productId, quantity });
            }
        }

        cart.items = cart.items.filter(item => item.product !== null);
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
