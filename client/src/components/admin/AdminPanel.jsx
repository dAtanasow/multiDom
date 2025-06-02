import { useState } from "react";
import Orders from "./orders-admin/Orders";
import ProductManager from "./products/products-admin/ProductsManager";

export default function AdminPanel() {
    const [section, setSection] = useState("products");
    const [orderStatus, setOrderStatus] = useState("new");

    return (
        <div className="flex flex-col text-center mt-2 xl:mt-12 md:mt-20 relative overflow-visible">
            <h2 className="text-2xl font-medium mb-4">Админ панел</h2>
            <div className="flex gap-4 justify-center mb-4">
                <button
                    onClick={() => setSection("products")}
                    className={`p-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${section === "products"
                        ? "bg-blue-500 text-white shadow"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    🛒 Продукти
                </button>

                <button
                    onClick={() => setSection("orders")}
                    className={`p-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${section === "orders"
                        ? "bg-blue-500 text-white shadow"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    📦 Поръчки
                </button>

            </div>

            {section === "products" && (
                <ProductManager />
            )}

            {section === "orders" && (
                <>
                    <div className="flex gap-2 justify-center mb-4">
                        <button
                            onClick={() => setOrderStatus("new")}
                            className={`p-2 rounded-lg text-sm font-medium transition-colors duration-200 ${orderStatus === "new"
                                ? "bg-green-500 text-white shadow"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            🆕 Нови
                        </button>

                        <button
                            onClick={() => setOrderStatus("pending")}
                            className={`p-2 rounded-lg text-sm font-medium transition-colors duration-200 ${orderStatus === "pending"
                                ? "bg-yellow-400 text-white shadow"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            ⏳ Чакащи
                        </button>

                        <button
                            onClick={() => setOrderStatus("completed")}
                            className={`p-2 rounded-lg text-sm font-medium transition-colors duration-200 ${orderStatus === "completed"
                                ? "bg-orange-400 text-white shadow"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            ✅ Приключени
                        </button>
                    </div>
                    <Orders status={orderStatus} />
                </>
            )}
        </div>
    );
}
