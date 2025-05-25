import { Link } from "react-router-dom";
import { useCartContext } from "../../context/CartContext";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

export default function Cart() {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCartContext();

    const total = cart.reduce((sum, item) => {
        const price = typeof item.price === 'number' ? item.price : 0;
        const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
        return sum + price * quantity;
    }, 0);

    if (!cart || cart.length === 0) {
        return (
            <div className="max-w-xl mx-auto py-20 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center justify-center space-y-4"
                >
                    <ShoppingCart size={48} className="text-gray-400" />
                    <h1 className="text-2xl font-bold text-gray-700">Твоята количка е празна</h1>
                    <p className="text-sm text-gray-500">Изглежда, че все още не си добавил нищо. Разгледай нашите продукти и започни пазаруването.</p>
                    <Link
                        to="/catalog"
                        className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2 rounded-full shadow transition"
                    >
                        Разгледай продукти
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl md:mt-10 mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold text-center mb-6">Моята количка</h1>
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
            <div className="mt-5 space-y-4 pt-4">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Общо:</span>
                    <span className="text-blue-600 font-semibold text-base">{total.toFixed(2)} лв.</span>
                </div>

                <div className="flex justify-between items-center flex-wrap gap-4">
                    <button
                        onClick={clearCart}
                        className="text-red-600 text-sm hover:underline"
                    >
                        Изчисти количката
                    </button>

                    <Link to="/checkout" className="ml-auto">
                        <button className="w-full md:w-64 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-sm transition">
                            Премини към поръчка
                        </button>
                    </Link>
                </div>

            </div>
        </div>
    );
}
