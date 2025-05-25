import { Link } from "react-router";
import { toast } from "react-toastify";
import { useCartContext } from "../../../context/CartContext";
import { normalizeProduct } from "../../../utils/normalize";

export default function ProductCard({ product }) {
    const { addToCartContext } = useCartContext();
    const normalized = normalizeProduct(product)

    const handleAddToCart = async () => {
        try {
            await addToCartContext(normalizeProduct(normalized));
            toast.success("Продуктът беше добавен в количката.");
        } catch (err) {
            console.error("Грешка при добавяне:", err);
            toast.error("Грешка при добавяне в количката.");
        }
    };

    if (!product) return null;

    return (
        <div className="relative bg-white p-2 rounded-md shadow-sm hover:shadow-md transition flex flex-col min-h-[240px] w-full max-w-full min-w-0">
            {product.discountPrice && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow">
                    {`-${Math.round(100 - (product.discountPrice / product.price) * 100)}%`}
                </div>
            )}

            <Link to={`/catalog/${product._id}`}>
                <img
                    src={product.images?.[0] || "/images/placeholder.jpg"}
                    alt={product.name}
                    className="h-32 w-full object-contain mb-2"
                />
            </Link>

            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2 leading-tight">
                        {product.name}
                    </h3>
                </div>

                <div className="mt-auto flex flex-col items-start gap-1">
                    {product.discountPrice ? (
                        <div className="flex items-baseline gap-2">
                            <p className="text-blue-600 text-sm font-bold">
                                {product.discountPrice.toFixed(2)} лв.
                            </p>
                            <p className="text-sm text-gray-500 line-through">
                                {product.price.toFixed(2)} лв.
                            </p>
                        </div>
                    ) : (
                        <p className="text-blue-600 text-sm font-bold">
                            {product.price.toFixed(2)} лв.
                        </p>
                    )}

                    <button
                        onClick={handleAddToCart}
                        className="w-full text-xs py-1 px-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Добави
                    </button>
                </div>
            </div>
        </div>
    );
}
