import { Link } from "react-router-dom";
import { useCartContext } from "../../context/CartContext";

export default function CartButton() {
    const { cart } = useCartContext();
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <Link
            to="/cart"
            className="relative cursor-pointer px-3 py-2 rounded-xl hover:bg-blue-700 hover:text-white transition"
            aria-label="Количка"
        >
            <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386a.75.75 0 0 1 .728.573L5.82 9.75h12.41a.75.75 0 0 1 .73.928l-1.2 5a.75.75 0 0 1-.73.572H8.032a.75.75 0 0 1-.728-.572L5.227 4.5H3"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 16.5h.008v.008H16.5v-.008Zm-9 0h.008v.008H7.5v-.008Z"
                />
            </svg>

            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {itemCount}
                </span>
            )}
        </Link>
    );
}
