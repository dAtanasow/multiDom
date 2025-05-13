const { default: mongoose } = require("mongoose");
const Review = require("../models/Review");

const getReviewsByProductId = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ productId }).populate("userId", "firstName lastName");
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: 'Грешка при зареждане на ревюта' });
    }
};

const addReview = async (req, res) => {
    const existing = await Review.findOne({
        productId,
        userId: req.user._id,
    });

    if (existing) {
        return res.status(409).json({ message: "Вече сте оставили ревю за този продукт." });
    }

    try {
        const { productId, rating, comment } = req.body;
        const review = await Review.create({
            productId,
            rating,
            comment,
            userId: req.user._id,
        });

        res.status(201).json(review);
    } catch (err) {
        res.status(400).json({ message: 'Грешка при създаване на ревю' });
    }
};

const updateReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;

        const review = await Review.findOneAndUpdate(
            { productId, userId: req.user._id },
            { rating, comment },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({ message: "Няма съществуващо ревю за редактиране." });
        }

        res.status(200).json(review);
    } catch (err) {
        res.status(400).json({ message: "Грешка при обновяване на ревю" });
    }
};

const likeReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user._id;

        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ message: 'Ревюто не е намерено' });

        const alreadyLiked = review.likes.includes(userId);
        if (alreadyLiked) {
            review.likes.pull(userId);
        } else {
            review.likes.addToSet(userId);
            review.dislikes.pull(userId);
        }

        await review.save();
        res.status(200).json({
            likes: review.likes.length,
            dislikes: review.dislikes.length,
            likedByUser: !alreadyLiked,
        });
    } catch (err) {
        res.status(500).json({ message: 'Грешка при харесване на ревю' });
    }
};

const dislikeReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user._id;

        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ message: 'Ревюто не е намерено' });

        const alreadyDisliked = review.dislikes.includes(userId);
        if (alreadyDisliked) {
            review.dislikes.pull(userId);
        } else {
            review.dislikes.addToSet(userId);
            review.likes.pull(userId);
        }

        await review.save();
        res.status(200).json({
            likes: review.likes.length,
            dislikes: review.dislikes.length,
            dislikedByUser: !alreadyDisliked,
        });
    } catch (err) {
        res.status(500).json({ message: 'Грешка при нехаресване на ревю' });
    }
};

const addComment = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { text } = req.body;

        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return res.status(400).json({ message: 'Моля, въведете текст на коментара.' });
        }

        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).json({ message: 'Невалиден reviewId' });
        }

        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ message: 'Ревюто не е намерено' });

        const newComment = {
            userId: req.user._id,
            name: `${req.user.firstName} ${req.user.lastName}`,
            text: text.trim(),
            likes: [],
            dislikes: [],
            replies: []
        };

        review.comments.push(newComment);
        await review.save();

        const savedComment = review.comments[review.comments.length - 1];
        res.status(201).json(savedComment);
    } catch (err) {
        console.error("Грешка при добавяне на коментар:", err);
        res.status(400).json({ message: 'Грешка при добавяне на коментар', error: err.message });
    }
}

const deleteComment = async (req, res) => {
    try {
        const { reviewId, commentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(reviewId) || !mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ message: "Невалидни ID-та" });
        }

        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ message: "Ревюто не е намерено" });

        const comment = review.comments.id(commentId);
        if (!comment) return res.status(404).json({ message: "Коментарът не е намерен" });

        if (!comment.userId.equals(req.user._id)) {
            return res.status(403).json({ message: "Нямате права да изтриете този коментар" });
        }

        review.comments.pull(comment._id); // използваме pull вместо remove
        await review.save();
        res.json({ message: "Коментарът е изтрит успешно" });
    } catch (err) {
        console.error("⚠️ Грешка при изтриване на коментар:", err);
        res.status(400).json({ message: "Грешка при изтриване на коментар" });
    }
};

const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ message: 'Ревюто не е намерено' });

        const isAuthor = review.userId.equals(req.user._id);
        const isAdmin = req.user.role === 'admin';

        if (!isAuthor && !isAdmin) {
            return res.status(403).json({ message: 'Нямате права да изтриете това ревю' });
        }

        await review.deleteOne();
        res.json({ message: 'Ревюто беше изтрито успешно' });
    } catch (err) {
        res.status(500).json({ message: 'Грешка при изтриване на ревю' });
    }
};

const likeComment = async (req, res) => {
    try {
        const { reviewId, commentId } = req.params;
        const userId = req.user._id;

        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ message: "Ревюто не е намерено" });

        const comment = review.comments.id(commentId);
        if (!comment) return res.status(404).json({ message: "Коментарът не е намерен" });

        const hasLiked = comment.likes.includes(userId);
        if (hasLiked) {
            comment.likes.pull(userId);
        } else {
            comment.likes.addToSet(userId);
            comment.dislikes.pull(userId);
        }

        await review.save();
        res.status(200).json({
            likes: comment.likes.length,
            dislikes: comment.dislikes.length,
            likedByUser: !hasLiked,
        });
    } catch (err) {
        res.status(500).json({ message: "Грешка при харесване на коментар" });
    }
};

const dislikeComment = async (req, res) => {
    try {
        const { reviewId, commentId } = req.params;
        const userId = req.user._id;

        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ message: "Ревюто не е намерено" });

        const comment = review.comments.id(commentId);
        if (!comment) return res.status(404).json({ message: "Коментарът не е намерен" });

        const hasDisliked = comment.dislikes.includes(userId);
        if (hasDisliked) {
            comment.dislikes.pull(userId);
        } else {
            comment.dislikes.addToSet(userId);
            comment.likes.pull(userId);
        }

        await review.save();
        res.status(200).json({
            likes: comment.likes.length,
            dislikes: comment.dislikes.length,
            dislikedByUser: !hasDisliked,
        });
    } catch (err) {
        res.status(500).json({ message: "Грешка при нехаресване на коментар" });
    }
};

const addReplyToComment = async (req, res) => {
    try {
        const { reviewId, commentId } = req.params;
        const { text } = req.body;

        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return res.status(400).json({ message: 'Моля, въведете текст на отговора.' });
        }

        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ message: "Ревюто не е намерено" });

        const comment = review.comments.id(commentId);
        if (!comment) return res.status(404).json({ message: "Коментарът не е намерен" });

        const newReply = {
            userId: req.user._id,
            name: `${req.user.firstName} ${req.user.lastName}`,
            text: text.trim(),
            likes: [],
            dislikes: [],
        };

        comment.replies.push(newReply);
        await review.save();

        const addedReply = comment.replies[comment.replies.length - 1];
        res.status(201).json(addedReply);
    } catch (err) {
        console.error("Грешка при добавяне на отговор:", err);
        res.status(500).json({ message: "Грешка при добавяне на отговор" });
    }
};

const likeReply = async (req, res) => {
    try {
        const { reviewId, commentId, replyId } = req.params;
        const userId = req.user._id;

        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ message: "Ревюто не е намерено" });

        const comment = review.comments.id(commentId);
        if (!comment) return res.status(404).json({ message: "Коментарът не е намерен" });

        const reply = comment.replies.id(replyId);
        if (!reply) return res.status(404).json({ message: "Отговорът не е намерен" });

        const alreadyLiked = reply.likes.includes(userId);
        if (alreadyLiked) {
            reply.likes.pull(userId);
        } else {
            reply.likes.push(userId);
            reply.dislikes.pull(userId);
        }

        await review.save();
        res.status(200).json(reply);
    } catch (err) {
        res.status(500).json({ message: "Грешка при харесване на отговор" });
    }
};

const dislikeReply = async (req, res) => {
    try {
        const { reviewId, commentId, replyId } = req.params;
        const userId = req.user._id;

        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ message: "Ревюто не е намерено" });

        const comment = review.comments.id(commentId);
        if (!comment) return res.status(404).json({ message: "Коментарът не е намерен" });

        const reply = comment.replies.id(replyId);
        if (!reply) return res.status(404).json({ message: "Отговорът не е намерен" });

        const alreadyDisliked = reply.dislikes.includes(userId);
        if (alreadyDisliked) {
            reply.dislikes.pull(userId);
        } else {
            reply.dislikes.push(userId);
            reply.likes.pull(userId);
        }

        await review.save();
        res.status(200).json(reply);
    } catch (err) {
        res.status(500).json({ message: "Грешка при нехаресване на отговор" });
    }
};

module.exports = {
    getReviewsByProductId,
    addReview,
    updateReview,
    likeReview,
    dislikeReview,
    addComment,
    deleteComment,
    deleteReview,
    likeComment,
    dislikeComment,
    addReplyToComment,
    likeReply,
    dislikeReply,
};
