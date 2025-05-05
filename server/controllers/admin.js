const Product = require("../models/Product");

const createProduct = async (req, res, next) => {
    try {
        const {
            name,
            manufacturer,
            category,
            subCategory,
            description,
            price,
            discountPrice,
            quantity,
            unitCount,
            unitType,
            images,
            originCountry,
            isFeatured,
        } = req.body;

        if (!name || !manufacturer || !category || !subCategory || !price) {
            return res.status(400).json({ message: 'Моля, попълнете всички задължителни полета.' });
        }


        const product = new Product({
            name,
            manufacturer,
            category,
            subCategory,
            description,
            price,
            discountPrice,
            quantity,
            unitCount,
            unitType,
            images: Array.isArray(images) ? images : [images],
            originCountry,
            isFeatured,
        });

        await product.save();

        res.status(201).json({ message: 'Продуктът е създаден успешно.', product });
    } catch (err) {
        next(err);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Продуктът не е намерен." });
        }

        res.status(200).json({ message: "Продуктът е обновен успешно.", product: updatedProduct });
    } catch (err) {
        next(err);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const productId = req.params.id;

        if (!productId) {
            return res.status(400).json({ message: "Липсва ID на продукта." });
        }

        const deleted = await Product.findByIdAndDelete(productId);

        if (!deleted) {
            return res.status(404).json({ message: "Продуктът не е намерен." });
        }

        res.status(200).json({ message: "Продуктът беше успешно изтрит." });
    } catch (err) {
        next(err);
    }
};


module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
}