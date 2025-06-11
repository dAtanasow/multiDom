import { Link } from "react-router-dom";
import { useCartContext } from "../../context/CartContext";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import CartItem from "./CartItem";
import { useEffect, useState } from "react";
import SpinnerLoader from "../SpinnerLoader";

export default function Cart() {
    const { cart, clearCart, updateQuantity, removeFromCart } = useCartContext();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, [cart]);

    const totalStandard = cart.reduce((sum, item) => {
        const price = typeof item.price === 'number' ? item.price : 0;
        return sum + price * item.quantity;
    }, 0);

    const totalWithDiscount = cart.reduce((sum, item) => {
        const price = typeof item.discountPrice === 'number' && item.discountPrice < item.price
            ? item.discountPrice
            : item.price;
        return sum + price * item.quantity;
    }, 0);

    if (loading) {
        return <SpinnerLoader />;
    }

    const totalDiscount = totalStandard - totalWithDiscount;
    if (!cart || cart.length === 0) {
        return (
            <div className="max-w-xl mx-auto py-40 px-6 text-center">
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
        <div className="max-w-3xl md:mt-20 mx-auto py-10 px-4">
            <h1 className="text-2xl font-medium text-center mb-6">Моята количка</h1>
            <div className="space-y-6">
                {cart.map((item) => (
                    <CartItem
                        key={item._id}
                        item={item}
                        updateQuantity={updateQuantity}
                        removeFromCart={removeFromCart}
                    />
                ))}
            </div>

            <div className="mt-5 space-y-4 pt-4">
                <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Общо (без отстъпка):</span>
                        <span className="font-semibold">{totalStandard.toFixed(2)} лв.</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Отстъпка:</span>
                        <span className="text-green-600">– {totalDiscount.toFixed(2)} лв.</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-800 font-medium">Общо с отстъпка:</span>
                        <span className="text-blue-600 font-semibold">{totalWithDiscount.toFixed(2)} лв.</span>
                    </div>
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
