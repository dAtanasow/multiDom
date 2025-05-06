import { useProductsTable } from "../../../hooks/useAdmin";

export default function ProductsTable({ setProductView, setEditingProduct }) {
    const {
        products,
        handleDelete,
    } = useProductsTable();

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setProductView("create");
    };


    return (
        <div className="pb-6 pt-6 max-w-4xl mx-auto">
            <table className="w-full text-center justify-center border text-sm">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-2 py-1">Снимка</th>
                        <th className="border px-2 py-1">Име</th>
                        <th className="border px-2 py-1">Цена</th>
                        <th className="border px-2 py-1">Промо</th>
                        <th className="border px-2 py-1">Налични</th>
                        <th className="border px-2 py-1">Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td className="border px-2 py-1 align-middle">
                                <div className="w-24 h-18 mx-auto">
                                    <img
                                        src={product.images?.[0]}
                                        alt={product.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </td>
                            <td className="border px-2 py-1">{product.name}</td>
                            <td className="border px-2 py-1">{product.price?.toFixed(2)}</td>
                            <td className={`border px-2 py-1 ${product.discountPrice ? "text-green-600 font-semibold" : ""}`}>
                                {product.discountPrice ? product.discountPrice.toFixed(2) : "-"}
                            </td>
                            <td className={`border px-2 py-1 ${product.quantity < 10 ? "bg-yellow-100 text-yellow-800 font-semibold" : ""}`}>
                                {product.quantity}
                            </td>

                            <td className="border space-x-2">
                                <button className="w-2/3 max-w-25 bg-yellow-500 m-1 text-white p-1 rounded hover:bg-yellow-600" onClick={() => handleEditClick(product)}>Редактирай</button>
                                <button className="w-2/3 max-w-25 bg-red-600 m-1 text-white p-1 rounded hover:bg-red-700" onClick={() => handleDelete(product._id)}>Изтрий</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
