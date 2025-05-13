const express = require("express");
const router = express.Router();
const {
    getReviewsByProductId,
    addReview,
    updateReview,
    likeReview,
    dislikeReview,
    addComment,
    deleteReview,
    likeComment,
    dislikeComment,
    deleteComment,
    addReplyToComment,
    likeReply,
    dislikeReply
} = require("../controllers/review");
const { auth } = require("../utils");

router.get("/:productId", getReviewsByProductId);

router.post("/", auth(), addReview);
router.put("/", auth(), updateReview);
router.put("/:reviewId/like", auth(), likeReview);
router.put("/:reviewId/dislike", auth(), dislikeReview);
router.post("/:reviewId/comments", auth(), addComment);
router.delete("/:reviewId", auth(), deleteReview);

router.put("/:reviewId/comments/:commentId/like", auth(), likeComment);
router.put("/:reviewId/comments/:commentId/dislike", auth(), dislikeComment);
router.post("/:reviewId/comments/:commentId/replies", auth(), addReplyToComment);
router.delete("/:reviewId/comments/:commentId", auth(), deleteComment);

router.put('/:reviewId/comments/:commentId/replies/:replyId/like', auth(), likeReply);
router.put('/:reviewId/comments/:commentId/replies/:replyId/dislike', auth(), dislikeReply);

module.exports = router;
