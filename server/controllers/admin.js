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

module.exports = {
    createProduct
}