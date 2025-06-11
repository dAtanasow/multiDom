import { useState } from "react";
import { motion } from "framer-motion";
import userApi from "../../api/auth";
import { useSearchParams } from "react-router";

export default function EmailConfirmationError() {
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    
    const email = searchParams.get("email");

    const handleResend = async () => {
        if (!email) {
            setError("Липсва имейл адрес.");
            return;
        }

        try {
            setLoading(true);
            await userApi.resendConfirmation(email);
            setIsSent(true);
            setError(null);
        } catch (err) {
            setError("Неуспешно изпращане на линка. Опитай отново.");
            console.log(err.message);
        } finally {
            setLoading(false);
            setTimeout(() => setIsSent(false), 5000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100 px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-white shadow-2xl rounded-3xl px-8 py-10 max-w-md w-full text-center border border-red-100"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 160 }}
                    className="flex justify-center mb-4"
                >
                    <div className="bg-red-100 text-red-600 p-4 rounded-full shadow-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </motion.div>

                <h1 className="text-3xl font-extrabold text-red-700 tracking-tight">
                    Грешка при потвърждението
                </h1>

                <p className="text-gray-600 mt-4 text-base leading-relaxed">
                    Връзката може да е невалидна или вече е изтекла. Ако проблемът продължава, можеш да получиш нов линк.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                    <a
                        href="/"
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all shadow-sm"
                    >
                        ⬅ Начална страница
                    </a>
                    <button
                        onClick={handleResend}
                        disabled={loading}
                        className="bg-white border border-red-400 text-red-600 hover:bg-red-50 font-semibold text-sm px-6 py-2.5 rounded-xl transition-all shadow disabled:opacity-50"
                    >
                        {loading ? "Изпращане..." : "Изпрати линка отново"}
                    </button>
                </div>

                {isSent && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 text-sm text-green-600 font-medium"
                    >
                        ✅ Изпратихме нов линк на {email}
                    </motion.div>
                )}

                {error && (
                    <div className="mt-4 text-sm text-red-500 font-medium">
                        {error}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
