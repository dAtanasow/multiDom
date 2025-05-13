import { ThumbsUp, ThumbsDown, Trash2 } from "lucide-react";
import ReviewForm from "./ReviewForm";
import CommentForm from "./CommentForm";
import useReviews from "../../hooks/useReviews";
import { useAuthContext } from "../../context/AuthContext";

export default function ReviewList({ productId }) {
    const { userId } = useAuthContext();

    const {
        reviews,
        expanded,
        loading,
        userReview,
        toggleExpanded,
        likeReview,
        dislikeReview,
        addComment,
        deleteReview,
        deleteComment,
        refetchReviews,
    } = useReviews(productId, userId);

    return (
        <div className="space-y-6 mt-10">
            <ReviewForm
                productId={productId}
                userReview={userReview}
                onReviewSubmit={refetchReviews}
            />
            {loading && <p className="text-sm text-gray-500">Зареждане на ревюта...</p>}

            {!loading && (!reviews || reviews.length === 0) && (
                <p className="text-sm text-gray-500">Няма ревюта</p>
            )}

            {reviews.map((review) => (
                <div
                    key={review._id}
                    className="bg-white p-4 rounded-lg shadow-sm border"
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">  {review.userId.firstName} {review.userId.lastName}</p>
                        <p className="text-yellow-500 text-lg">
                            {"★".repeat(review.rating)}
                            {"☆".repeat(5 - review.rating)}
                        </p>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{review.comment}</p>

                    <div className="flex items-center gap-4 text-sm">
                        <button
                            className="flex items-center gap-1 text-blue-600"
                            onClick={() => likeReview(review._id)}
                        >
                            <ThumbsUp size={16} /> {review.likes.length}
                        </button>
                        <button
                            className="flex items-center gap-1 text-red-500"
                            onClick={() => dislikeReview(review._id)}
                        >
                            <ThumbsDown size={16} /> {review.dislikes.length}
                        </button>
                        <button
                            className="text-gray-500 hover:underline"
                            onClick={() => toggleExpanded(review._id)}
                        >
                            {expanded[review._id] ? "Скрий коментари" : "Виж коментари"}
                        </button>
                        {userId === review.userId._id && (
                            <button
                                className="text-sm flex gap-1 text-red-600 ml-auto"
                                onClick={() => {
                                    if (window.confirm("Сигурни ли сте, че искате да изтриете това ревю?")) {
                                        deleteReview(review._id);
                                    }
                                }}
                            >
                                <Trash2 size={16} />
                            </button>
                        )}

                    </div>

                    {expanded[review._id] && (
                        <div className="mt-4 border-t pt-3 space-y-3">
                            {Array.isArray(review.comments) && review.comments.map((c) => (
                                <div
                                    key={c._id}
                                    className="bg-gray-100 p-3 rounded-lg shadow-sm flex justify-between items-start gap-4"
                                >
                                    <div className="text-sm text-gray-800">
                                        <p className="font-semibold mb-1">{c?.name || "Анонимен"}:</p>
                                        <p className="text-gray-700">{c.text}</p>
                                    </div>
                                    {userId === c.userId && (
                                        <button
                                            onClick={() => deleteComment(review._id, c._id)}
                                            className="text-xs text-red-500 hover:underline whitespace-nowrap"
                                        >
                                            Изтрий
                                        </button>
                                    )}
                                </div>
                            ))}

                            <CommentForm onSubmit={(text) => addComment(review._id, text)} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
