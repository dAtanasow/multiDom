import { useProductsAdmin } from "../../hooks/useAdmin";

export default function AdminPanel() {
    const {
        products,
        values,
        pending,
        editingProduct,
        navLinks,
        changeHandler,
        submitHandler,
        handleEdit,
        handleDelete,
        handleImageUpload,
        removeImage,
    } = useProductsAdmin();

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Админ панел - Продукти</h2>

            <form onSubmit={submitHandler} className="space-y-4 mb-6">
                <input
                    name="name"
                    placeholder="Име"
                    value={values.name}
                    onChange={changeHandler}
                    className="border p-2 w-full"
                />
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="border p-2 w-full"
                />
                {Array.isArray(values.images) && values.images.length > 0 && (
                    <div className="flex flex-wrap gap-4 mt-2">
                        {values.images.map((img, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={img}
                                    alt={`Снимка ${index + 1}`}
                                    className="h-24 w-24 object-contain border rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-0 right-0 bg-red-600 text-white px-1 rounded-bl text-xs"
                                    title="Премахни снимката"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <input
                    name="price"
                    type="number"
                    placeholder="Цена"
                    value={values.price}
                    onChange={changeHandler}
                    className="border p-2 w-full"
                />
                <input
                    name="manufacturer"
                    placeholder="Производител"
                    value={values.manufacturer}
                    onChange={changeHandler}
                    className="border p-2 w-full"
                />
                <textarea
                    name="description"
                    placeholder="Описание"
                    value={values.description}
                    onChange={changeHandler}
                    className="border p-2 w-full"
                    rows={3}
                />
                <input
                    name="tags"
                    placeholder="Тагове (разделени със запетая)"
                    value={values.tags}
                    onChange={changeHandler}
                    className="border p-2 w-full"
                />
                <select name="category" value={values.category} onChange={changeHandler} className="border p-2 w-full">
                    <option value="">Избери категория</option>
                    {navLinks.map((cat) => (
                        <option key={cat.label} value={cat.label}>{cat.label}</option>
                    ))}
                </select>
                <select name="subCategory" value={values.subCategory} onChange={changeHandler} className="border p-2 w-full">
                    <option value="">Избери подкатегория</option>
                    {navLinks
                        .find((cat) => cat.label === values.category)?.subLinks?.map((sub) => (
                            <option key={sub.label} value={sub.label}>{sub.label}</option>
                        ))}
                </select>
                <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                    disabled={pending}
                >
                    {editingProduct ? "Запази промените" : "Създай продукт"}
                </button>
            </form>

            <table className="w-full border text-sm">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-2   py-1">Снимка</th>
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
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="h-12 w-12 object-contain"
                                />
                            </td>
                            <td className="border px-2 py-1">{product.name}</td>
                            <td className="border px-2 py-1">{product.price.toFixed(2)} лв.</td>
                            <td className="border px-2 py-1">{product.category}</td>
                            <td className="border px-2 py-1">{product.subCategory}</td>
                            <td className="border px-2 py-1 space-x-2">
                                <button
                                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                    onClick={() => handleEdit(product)}
                                >
                                    Редактирай
                                </button>
                                <button
                                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                    onClick={() => handleDelete(product._id)}
                                >
                                    Изтрий
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
