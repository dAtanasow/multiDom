const Product = require('../models/Product');

const getAllProducts = async (req, res, next) => {
    try {
        const {
            search,
            subCategory,
            category,
            minPrice,
            maxPrice,
            sortBy,
            order = 'asc',
            page = 1,
            limit = 12,
        } = req.query;

        const filter = {};
        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        if (subCategory) {
            filter.subCategory = subCategory;
        }

        if (category) {
            filter.category = category;
        }

        if (req.query.featured === 'true') {
            filter.isFeatured = true;
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        const sortOptions = {};
        if (sortBy) {
            sortOptions[sortBy] = order === 'desc' ? -1 : 1;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Product.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);

        const products = await Product.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({
            products,
            total,
            totalPages,
            currentPage: parseInt(page),
        });
    } catch (err) {
        next(err);
    }
};

const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Продуктът не е намерен." });
        }

        res.status(200).json(product);
    } catch (err) {
        console.error("Грешка при намиране на продукт по ID:", err);
        res.status(500).json({ message: "Възникна грешка при зареждане на продукта." });
    }
};

module.exports = {
    getAllProducts,
    getProductById
};
