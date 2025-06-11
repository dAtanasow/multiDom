import { useCartContext } from "../../context/CartContext";

export default function CartItem({ item, updateQuantity, removeFromCart }) {
    const { updatingId } = useCartContext();
    const isUpdating = updatingId === item._id;

    const hasDiscount = typeof item.discountPrice === "number" && item.discountPrice < item.price;
    const priceRaw = hasDiscount ? item.discountPrice : item.price;
    const price = typeof priceRaw === "number" ? priceRaw : 0;
    const quantity = typeof item.quantity === "number" ? item.quantity : 0;

    return (
        <div className="flex items-start gap-4 border-b pb-4">
            <img
                src={item.images?.[0] || "/placeholder.jpg"}
                alt={item.name}
                className="w-20 h-20 object-contain rounded"
            />
            <div className="flex-1">
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm">
                    Цена:{" "}
                    {hasDiscount ? (
                        <>
                            <span className="line-through mr-2">
                                {typeof item.price === "number" ? item.price.toFixed(2) : "–"} лв.
                            </span>
                            <span className="text-green-600 font-semibold">
                                {typeof item.discountPrice === "number" ? item.discountPrice.toFixed(2) : "–"} лв.
                            </span>
                        </>
                    ) : (
                        `${typeof item.price === "number" ? `${item.price.toFixed(2)} лв.` : "–"} лв.`
                    )}
                </p>

                <div className="flex items-center gap-2 mt-2">
                    <button
                        className="w-7 h-7 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={isUpdating}
                    >
                        -
                    </button>

                    <span className="px-2 text-sm">{item.quantity}</span>

                    <button
                        className="w-7 h-7 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        disabled={isUpdating}
                    >
                        +
                    </button>
                </div>

                <div className="flex justify-between items-center mt-2">
                    <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-600 text-sm hover:underline"
                    >
                        Премахни
                    </button>
                    <span className="font-semibold text-sm">
                        {(price * quantity).toFixed(2)} лв.
                    </span>
                </div>
            </div>
        </div>
    );
}
