import { useState, useEffect, useCallback } from "react";
import reviewApi from "../api/review";

export default function useReviews(productId, currentUserId) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState({});

    const fetchReviews = useCallback(async () => {
        if (!productId) return;
        setLoading(true);
        try {
            const data = await reviewApi.getByProduct(productId);
            setReviews(data);
        } catch (err) {
            console.error("Грешка при зареждане на ревюта:", err);
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const userReview = Array.isArray(reviews)
        ? reviews.find((r) => r.userId._id === currentUserId)
        : null;

    const toggleExpanded = (id) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const likeReview = async (id) => {
        try {
            await reviewApi.like(id, { userId: currentUserId });
            fetchReviews();
        } catch (err) {
            console.error("Грешка при харесване:", err);
        }
    };

    const dislikeReview = async (id) => {
        try {
            await reviewApi.dislike(id, { userId: currentUserId });
            fetchReviews();
        } catch (err) {
            console.error("Грешка при дислайк:", err);
        }
    };

    const addComment = async (reviewId, commentText) => {
        try {
            await reviewApi.addComment(reviewId, { text: commentText });
            fetchReviews();
        } catch (err) {
            console.error("Грешка при добавяне на коментар:", err);
        }
    };

    const deleteReview = async (reviewId) => {
        try {
            await reviewApi.remove(reviewId);
            setReviews((prev) => prev.filter((r) => r._id !== reviewId));
        } catch (err) {
            console.error("Грешка при изтриване на ревю:", err);
        }
    };

    const deleteComment = async (reviewId, commentId) => {
        try {
            await reviewApi.removeComment(reviewId, commentId);
            fetchReviews();
        } catch (err) {
            console.error("Грешка при изтриване на коментар:", err);
        }
    };

    return {
        reviews,
        userReview,
        loading,
        expanded,
        toggleExpanded,
        likeReview,
        dislikeReview,
        addComment,
        deleteReview,
        deleteComment,
        refetchReviews: fetchReviews,
    };
}
