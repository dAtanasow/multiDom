import { Link } from "react-router-dom";
import { useCartContext } from "../../context/CartContext";

export default function Cart() {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCartContext();

    const total = cart.reduce((sum, item) => {
        const price = typeof item.price === 'number' ? item.price : 0;
        const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
        return sum + price * quantity;
    }, 0);

    if (!cart || cart.length === 0) {
        return (
            <div className="max-w-4xl mx-auto py-16 px-4 text-center">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">Количката е празна</h1>
                <Link to="/catalog" className="text-blue-600 hover:underline">Разгледай продукти</Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-6">Моята количка</h1>

            <div className="space-y-6">
                {cart.map((item) => (
                    <div key={item._id} className="flex items-start gap-4 border-b pb-4">
                        <img
                            src={item.images?.[0] || "/placeholder.jpg"}
                            alt={item.name}
                            className="w-20 h-20 object-contain rounded"
                        />
                        <div className="flex-1">
                            <p className="font-medium text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-500">Цена: {item.price.toFixed(2)} лв.</p>

                            <div className="flex items-center gap-2 mt-2">
                                <button
                                    className="w-7 h-7 bg-gray-200 rounded hover:bg-gray-300"
                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                >
                                    -
                                </button>
                                <span className="px-2 text-sm">{item.quantity}</span>
                                <button
                                    className="w-7 h-7 bg-gray-200 rounded hover:bg-gray-300"
                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
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
                                    {(item.price * item.quantity).toFixed(2)} лв.
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Общо и действия */}
            <div className="mt-10 space-y-4 pt-4">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Общо:</span>
                    <span className="text-blue-600 font-semibold text-base">{total.toFixed(2)} лв.</span>
                </div>

                <div className="flex justify-between items-center">
                    <button
                        onClick={clearCart}
                        className="text-red-600 text-sm hover:underline"
                    >
                        Изчисти количката
                    </button>
                </div>

                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm">
                    Премини към поръчка
                </button>
            </div>
        </div>
    );
}
