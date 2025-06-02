const Product = require('../models/Product');
const Review = require('../models/Review');

const getAllProducts = async (req, res, next) => {
    try {
        const {
            search,
            tag,
            subCategory,
            category,
            minPrice,
            maxPrice,
            sortBy,
            order = 'asc',
            page = 1,
            limit,
        } = req.query;

        const limitNum = limit ? Number(limit) : undefined;
        const skip = limitNum ? (Number(page) - 1) * limitNum : undefined;

        const filter = {};
        if (search) {
            const searchRegex = { $regex: search, $options: 'i' };

            filter.$or = [
                { name: searchRegex },
                { description: searchRegex },
                { category: searchRegex },
                { subCategory: searchRegex },
                { tags: { $elemMatch: searchRegex } },
            ];
        }

        if (tag) {
            filter.tags = { $in: [tag] };
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
        if (req.query.tag) {
            filter.tags = { $in: [req.query.tag] };
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

        const total = await Product.countDocuments(filter);
        const totalPages = Math.ceil(total / limitNum);

        let query = Product.find(filter).sort(sortOptions);
        if (skip !== undefined) query = query.skip(skip);
        if (limitNum !== undefined) query = query.limit(limitNum);

        const products = await query;

        res.status(200).json({
            products,
            total,
            totalPages,
            currentPage: limitNum ? parseInt(page) : 1,
        });
    } catch (err) {
        next(err);
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Продуктът не е намерен" });

        const reviews = await Review.find({ productId: product._id });
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        const avgRating = reviews.length ? sum / reviews.length : 0;

        res.json({ ...product.toObject(), averageRating: avgRating });
    } catch (err) {
        res.status(500).json({ message: "Грешка при зареждане на продукта" });
    }
};

module.exports = {
    getAllProducts,
    getProductById
};