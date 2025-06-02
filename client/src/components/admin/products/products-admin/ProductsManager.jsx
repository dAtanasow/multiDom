import { useState } from "react";
import CreateProduct from "./create/CreateProduct";
import ProductsTable from "./table/ProductsTable";

export default function ProductsManager() {
    const [productView, setProductView] = useState("list");
    const [editingProduct, setEditingProduct] = useState(null);

    return (
        <>
            <div className="flex gap-2 justify-center mb-4">
                <button
                    onClick={() => {
                        setEditingProduct(null);
                        setProductView("create");
                    }}
                    className={`p-2 rounded-lg text-sm font-medium transition-colors duration-200 ${productView === "create"
                        ? "bg-green-500 text-white shadow"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    ➕ Създай продукт
                </button>

                <button
                    onClick={() => setProductView("list")}
                    className={`p-2 rounded-lg text-sm font-medium transition-colors duration-200 ${productView === "list"
                        ? "bg-green-500 text-white shadow"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    📃 Списък с продукти
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
    );
}
