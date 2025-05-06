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
        <div className="p-6 max-w-4xl mx-auto">
            <table className="w-full border text-sm">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-2 py-1">Снимка</th>
                        <th className="border px-2 py-1">Име</th>
                        <th className="border px-2 py-1">Цена</th>
                        <th className="border px-2 py-1">Категория</th>
                        <th className="border px-2 py-1">Подкатегория</th>
                        <th className="border px-2 py-1">Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td className="border px-2 py-1">
                                <img src={product.images?.[0]} alt={product.name} className="h-12 w-12 object-contain" />
                            </td>
                            <td className="border px-2 py-1">{product.name}</td>
                            <td className="border px-2 py-1">{product.price?.toFixed(2)} лв.</td>
                            <td className="border px-2 py-1">{product.category}</td>
                            <td className="border px-2 py-1">{product.subCategory}</td>
                            <td className="border px-2 py-1 space-x-2">
                                <button className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600" onClick={() => handleEditClick(product)}>Редактирай</button>
                                <button className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700" onClick={() => handleDelete(product._id)}>Изтрий</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
