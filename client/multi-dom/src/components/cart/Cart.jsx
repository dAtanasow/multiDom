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
        <div className="max-w-5xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-6">Моята количка</h1>

            <div className="space-y-6">
                {cart
                    .filter((item) => item && typeof item.price === 'number' && item.name)
                    .map((item) => (
                        <div key={item._id} className="flex items-center gap-4 border-b pb-4">
                            <img src={item.images?.[0] || "/placeholder.jpg"} alt={item.name || 'Продукт'} className="h-20 w-20 object-contain rounded" />
                            <div className="flex-1">
                                <p className="font-medium text-gray-800">{item.name || 'Непознат продукт'}</p>
                                <p className="text-sm text-gray-500">Цена: {item.price?.toFixed(2) || 'н.д.'}</p>
                                <div className="flex items-center mt-2 gap-2">
                                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-2 py-1 bg-gray-200 rounded">-</button>
                                    <span className="px-2 text-sm">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
                                    <button onClick={() => removeFromCart(item._id)} className="ml-4 text-red-500 text-sm hover:underline">Премахни</button>
                                </div>
                            </div>
                            <div className="text-right font-semibold text-gray-700">
                                {(item.price * item.quantity).toFixed(2)} лв.
                            </div>
                        </div>
                    ))}

            </div>

            <div className="mt-10 flex justify-between items-center border-t pt-6">
                <button
                    className="text-red-600 hover:underline text-sm"
                    onClick={clearCart}
                >
                    Изчисти количката
                </button>
                <div className="text-lg font-semibold">
                    Общо: <span className="text-blue-600">{total.toFixed(2)} лв.</span>
                </div>
            </div>

            <div className="mt-6 text-right">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow">
                    Премини към поръчка
                </button>
            </div>
        </div>
    );
}