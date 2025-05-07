import { Link } from "react-router";
import { toast } from "react-toastify";
import { useCartContext } from "../../context/CartContext";

export default function ProductCard({ product }) {
    const { addToCart } = useCartContext();

    if (!product) return null;

    return (
        <div className="bg-white p-2 rounded-md shadow-sm hover:shadow-md transition flex flex-col min-h-[240px] w-full max-w-full min-w-0">
            <Link to={`/catalog/${product._id}`}>
                <img
                    src={product.images?.[0] || "/images/placeholder.jpg"}
                    alt={product.name}
                    className="h-32 w-full object-contain mb-2"
                />
            </Link>

            <div className="flex-1 flex flex-col">
                <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2 leading-tight">
                    {product.name}
                </h3>
                <p className="text-blue-600 text-sm font-bold">
                    {product.price.toFixed(2)} лв.
                </p>

                <button
                    onClick={() => {
                        addToCart(product);
                        toast.success("Продуктът беше добавен в количката.");
                    }}
                    className="mt-auto text-xs py-1 px-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Добави
                </button>
            </div>
        </div>
    );
}
