import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ThankYouPage() {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto mt-10 sm:mt-20 text-center p-8 bg-white"
        >
            <div className="flex justify-center mb-3">
                <CheckCircle className="text-green-600 w-12 h-12" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-2">
                Благодарим за поръчката!
            </h1>

            <p className="text-gray-600 text-lg mb-4">
                Получихме вашата заявка успешно. Ще се свържем с вас при необходимост.
            </p>

            <p className="text-gray-500 text-sm mb-6">
                Проверете имейла си за потвърждение и детайли относно поръчката.
            </p>

            <hr className="my-6 border-gray-200" />

            <button
                onClick={() => navigate("/")}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-xl transition"
            >
                Обратно към началната страница
            </button>
        </motion.div>
    );
}
