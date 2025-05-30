import { ThumbsUp, ThumbsDown, Trash2 } from "lucide-react";
import ReviewForm from "./ReviewForm";
import CommentForm from "./CommentForm";
import useReviews from "../../hooks/useReviews";
import { useAuthContext } from "../../context/AuthContext";
import SpinnerLoader from "../SpinnerLoader";

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
            {loading && <SpinnerLoader />}

            {!loading && (!reviews || reviews.length === 0) && (
                <p className="text-sm text-gray-500">Няма ревюта</p>
            )}

            {reviews.map((review) => (
                <div key={review._id} className="bg-white p-5 rounded-2xl shadow border border-gray-100">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <p className="text-base font-semibold text-gray-800">
                                {review.userId.firstName} {review.userId.lastName}
                            </p>
                            <p className="text-sm text-gray-600">{review.comment}</p>
                        </div>
                        <div className="text-yellow-500 text-sm font-medium whitespace-nowrap">
                            {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-sm">
                        <button onClick={() => likeReview(review._id)} className="flex items-center gap-1 text-blue-600 hover:underline">
                            <ThumbsUp size={16} /> {review.likes.length}
                        </button>
                        <button onClick={() => dislikeReview(review._id)} className="flex items-center gap-1 text-red-500 hover:underline">
                            <ThumbsDown size={16} /> {review.dislikes.length}
                        </button>
                        <button onClick={() => toggleExpanded(review._id)} className="text-gray-500 hover:underline">
                            {expanded[review._id] ? "Скрий коментари" : "Виж коментари"}
                        </button>
                        {userId === review.userId._id && (
                            <button onClick={() => window.confirm("Сигурни ли сте, че искате да изтриете това ревю?") && deleteReview(review._id)}
                                className="ml-auto text-red-500 hover:text-red-700">
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>

                    {expanded[review._id] && (
                        <div className="mt-4 bg-gray-50 rounded-xl p-4 space-y-3">
                            {review.comments?.map((c) => (
                                <div key={c._id} className="flex justify-between items-start text-sm text-gray-800">
                                    <div>
                                        <p className="font-medium mb-1">{c?.name || "Анонимен"}:</p>
                                        <p className="text-gray-700">{c.text}</p>
                                    </div>
                                    {userId === c.userId && (
                                        <button onClick={() => deleteComment(review._id, c._id)} className="text-red-500 hover:underline text-xs">
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
