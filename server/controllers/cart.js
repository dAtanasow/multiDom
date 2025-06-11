const { mongoose } = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(200).json({ items: [] });
        }

        const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
        if (!cart) return res.status(200).json({ items: [] });

        const cleanedItems = cart.items.filter(item => item.product !== null);
        if (cleanedItems.length !== cart.items.length) {
            cart.items = cleanedItems;
            await cart.save();
        }

        const flatItems = cleanedItems.map(item => {
            const product = item.product;
            return {
                _id: product._id,
                name: product.name,
                price: product.price,
                discountPrice: product.discountPrice,
                images: product.images || [],
                quantity: item.quantity
            };
        });

        res.status(200).json({ items: flatItems });
    } catch (err) {
        next(err);
    }
};

const updateCart = async (req, res, next) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Изисква се автентикация." });
        const { items } = req.body;

        if (!Array.isArray(items)) {
            return res.status(400).json({ message: "Невалиден формат на items" });
        }

        const validatedItems = [];
        for (const item of items) {
            if (!item.product || !mongoose.Types.ObjectId.isValid(item.product)) {
                return res.status(400).json({ message: "Невалиден productId" });
            }
            if (typeof item.quantity !== "number" || item.quantity < 1) {
                return res.status(400).json({ message: "Невалидно количество" });
            }
            validatedItems.push(item);
        }

        const cart = await Cart.findOneAndUpdate(
            { user: req.user._id },
            { $set: { items: validatedItems } },
            { upsert: true, new: true }
        ).populate("items.product");

        res.status(200).json(cart);
    } catch (err) {
        console.error("Грешка при обновяване на количката:", err);
        res.status(500).json({ message: "Вътрешна сървърна грешка" });
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
        console.error("❌ Грешка в deleteCartItem:", err);
        next(err);
    }
};

const clearCart = async (req, res, next) => {
    try {
        if (!req.user) return res.status(401).json({ message: "Изисква се автентикация." });

        const cart = await Cart.findOneAndUpdate(
            { user: req.user._id },
            { $set: { items: [] } },
            { new: true }
        ).populate("items.product");

        res.status(200).json(cart);
    } catch (err) {
        console.error("❌ Грешка в clearCart:", err);
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
            return res.status(200).json({
                message: "Гост потребител — количката се управлява от клиента",
                localOnly: true
            });
        }

        const userId = req.user._id;

        let cart = await Cart.findOneAndUpdate(
            { user: userId, "items.product": productId },
            { $inc: { "items.$.quantity": quantity } },
            { new: true }
        ).populate("items.product");

        if (!cart) {
            cart = await Cart.findOneAndUpdate(
                { user: userId },
                { $push: { items: { product: productId, quantity } } },
                { upsert: true, new: true }
            ).populate("items.product");
        }

        const flatItems = cart.items.map(item => {
            const product = item.product;
            return {
                _id: product._id,
                name: product.name,
                price: product.price,
                discountPrice: product.discountPrice,
                images: product.images || [],
                quantity: item.quantity
            };
        });

        return res.status(200).json({ items: flatItems });

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
