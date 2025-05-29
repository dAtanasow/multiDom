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
        <div className="relative bg-white p-3 rounded-xl shadow-md hover:shadow-lg transition-all flex flex-col h-[380px]">
            {product.discountPrice && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-lg uppercase tracking-wide z-10">
                    {`-${Math.round(100 - (product.discountPrice / product.price) * 100)}%`}
                </div>
            )}

            <Link to={`/catalog/${product._id}`} className="block rounded-md p-2">
                <img
                    src={product.images?.[0] || "/images/placeholder.jpg"}
                    alt={product.name}
                    className="h-44 w-full object-contain transition-transform duration-200 hover:scale-105"
                />
            </Link>

            <div className="flex-1 flex flex-col justify-between mt-2">
                <h3 className="font-semibold text-gray-800 leading-tight">
                    {product.name}
                </h3>
                <p className="text-sm text-gray-700 mb-6">
                    {product.unitCount} {product.unitType}
                </p>

                <div>
                    {product.discountPrice ? (
                        <div className="flex items-center justify-between gap-2 font-bold text-blue-600">
                            <span className="text-lg">{product.discountPrice.toFixed(2)} лв.</span>
                            <span className="text-s text-gray-400 line-through">{product.price.toFixed(2)} лв.</span>
                        </div>
                    ) : (
                        <div className="text-lg font-bold text-blue-600">{product.price.toFixed(2)} лв.</div>
                    )}

                    <button
                        onClick={handleAddToCart}
                        className="mt-2 w-full text-xs py-1 px-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        Добави
                    </button>
                </div>
            </div>
        </div>
    );
}
