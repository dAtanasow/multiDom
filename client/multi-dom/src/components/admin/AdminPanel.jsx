import { useState } from "react";
import OrdersAdmin from "./orders-admin/OrdersAdmin";
import CreateProduct from "./products-admin/CreateProduct";
import ProductsTable from "./products-admin/ProductsTable";

export default function AdminPanel() {
    const [section, setSection] = useState("products");
    const [productView, setProductView] = useState("create");
    const [orderStatus, setOrderStatus] = useState("new");
    const [editingProduct, setEditingProduct] = useState(null);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Админ панел</h2>
            {/* Основна навигация */}
            <div className="flex gap-4 mb-4">
                <button onClick={() => setSection("products")} className={`px-4 py-2 ${section === "products" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                    Продукти
                </button>
                <button onClick={() => setSection("orders")} className={`px-4 py-2 ${section === "orders" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                    Поръчки
                </button>
            </div>

            {/* Подменю за продукти */}
            {section === "products" && (
                <>
                    <div className="flex gap-2 mb-4">
                        <button onClick={() => setProductView("create")} className={`px-3 py-1 ${productView === "create" ? "bg-green-600 text-white" : "bg-gray-100"}`}>
                            Създай продукт
                        </button>
                        <button onClick={() => setProductView("list")} className={`px-3 py-1 ${productView === "list" ? "bg-green-600 text-white" : "bg-gray-100"}`}>
                            Списък с продукти
                        </button>
                    </div>
                    {productView === "create" ? (
                        <CreateProduct
                            editingProduct={editingProduct}
                            setEditingProduct={setEditingProduct}
                            setProductView={setProductView}
                        />
                    ) : (
                        <ProductsTable
                            setProductView={setProductView}
                            setEditingProduct={setEditingProduct}
                        />
                    )}
                </>
            )}

            {/* Подменю за поръчки */}
            {section === "orders" && (
                <>
                    <div className="flex gap-2 mb-4">
                        <button onClick={() => setOrderStatus("new")} className={`px-3 py-1 ${orderStatus === "new" ? "bg-yellow-600 text-white" : "bg-gray-100"}`}>
                            Нови
                        </button>
                        <button onClick={() => setOrderStatus("pending")} className={`px-3 py-1 ${orderStatus === "pending" ? "bg-yellow-600 text-white" : "bg-gray-100"}`}>
                            Чакащи
                        </button>
                        <button onClick={() => setOrderStatus("completed")} className={`px-3 py-1 ${orderStatus === "completed" ? "bg-yellow-600 text-white" : "bg-gray-100"}`}>
                            Изпълнени
                        </button>
                    </div>
                    <OrdersAdmin status={orderStatus} />
                </>
            )}
        </div>
    );
}
