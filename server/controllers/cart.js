const { mongoose } = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(200).json({ items: [] }); // За гости — празна или локална количка
        }
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
        if (!req.user) return res.status(401).json({ message: "Изисква се автентикация." });
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
        if (!req.user) return res.status(401).json({ message: "Изисква се автентикация." });
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
        if (!req.user) return res.status(401).json({ message: "Изисква се автентикация." });
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

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Невалидно ID на продукт" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Продуктът не съществува" });
        }

        if (!req.user || !req.user._id) {
            console.log("🔓 Гост добавя продукт. Прекратено.");
            return res.status(200).json({ message: "Продуктът е добавен локално (гост)" });
        }

        const userId = req.user._id;
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const item = cart.items.find(i => i.product.toString() === productId);
        if (item) {
            item.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        await cart.populate("items.product");

        res.status(200).json(cart);
    } catch (err) {
        console.error("❌ Грешка в addToCart:", err);
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
