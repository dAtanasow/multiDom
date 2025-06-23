import { useState } from "react";
import { Star } from "lucide-react";
// import { toast } from "react-toastify";
import { toast } from "sonner";
import reviewApi from "../../api/review";

export default function ReviewForm({ productId, onReviewSubmit, userReview }) {
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    if (userReview) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (userReview) {
                await reviewApi.update({ productId, rating, comment });
            } else {
                await reviewApi.create({ productId, rating, comment });
            }
            toast.success("Благодарим за отзива!");
            setRating(0);
            setComment("");
            onReviewSubmit?.();
        } catch (err) {
            if (err?.response?.status === 401) {
                toast.error("Трябва да сте логнати за да публикувате отзив");
            } else {
                toast.error("Грешка при изпращане на отзив.", err);
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
            <p className="text-sm font-medium">Оценете продукта:</p>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={24}
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => setRating(star)}
                        className={`cursor-pointer ${(hovered || rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                    />
                ))}
            </div>

            <textarea
                placeholder="Вашето мнение..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border p-2 rounded-md text-sm"
                rows={3}
            />

            <button
                type="submit"
                disabled={rating === 0 || submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {submitting ? "Изпращане..." : "Изпрати отзив"}
            </button>
        </form>
    );
}
