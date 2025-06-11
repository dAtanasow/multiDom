import { motion } from "framer-motion";

export default function EmailAlreadyConfirmed() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-white shadow-2xl rounded-3xl px-8 py-10 max-w-md w-full text-center border border-blue-100"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 160 }}
                    className="flex justify-center mb-4"
                >
                    <div className="bg-blue-100 text-blue-600 p-4 rounded-full shadow-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 6L9 17l-5-5" />
                        </svg>
                    </div>
                </motion.div>

                <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">
                    Имейлът вече е потвърден
                </h1>

                <p className="text-gray-600 mt-3 text-base">
                    Не е необходимо да правиш нищо друго. Всичко е наред. ✅
                </p>

                <a
                    href="/"
                    className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all shadow-sm"
                >
                    ⬅ Към началната страница
                </a>
            </motion.div>
        </div>
    );
}
