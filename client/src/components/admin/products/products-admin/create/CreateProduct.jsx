import { useCreateProduct } from "../../../../../hooks/useAdmin";

export default function CreateProduct({ editingProduct, setEditingProduct, setProductView }) {
    const {
        values,
        pending,
        navLinks,
        changeHandler,
        submitHandler,
        handleImageUpload,
        removeImage,
    } = useCreateProduct(editingProduct, setEditingProduct, setProductView);

    return (
        <div className="p-2 max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {editingProduct ? `Редакция на продукт: ${editingProduct.name}` : "Създай нов продукт"}
            </h2>
            <form onSubmit={submitHandler} className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="border p-2 w-full md:col-span-2" />

                    {Array.isArray(values.images) && values.images.length > 0 && (
                        <div className="md:col-span-2 flex flex-wrap gap-4 mt-2">
                            {values.images.map((img, index) => (
                                <div key={index} className="relative">
                                    <img src={img} alt={`Снимка ${index + 1}`} className="h-24 w-24 object-contain border rounded" />
                                    <button type="button" onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-red-600 text-white px-1 rounded-bl text-xs" title="Премахни снимката">×</button>
                                </div>
                            ))}
                        </div>
                    )}
                    <select name="category" value={values.category || ""} onChange={changeHandler} className="border p-2 w-full">
                        <option value="">Избери категория</option>
                        {navLinks.map((cat) => (
                            <option key={cat.label} value={cat.label}>{cat.label}</option>
                        ))}
                    </select>

                    <select name="subCategory" value={values.subCategory || ""} onChange={changeHandler} className="border p-2 w-full">
                        <option value="">Избери подкатегория</option>
                        {navLinks.find((cat) => cat.label === values.category)?.subLinks?.map((sub) => (
                            <option key={sub.label} value={sub.label}>{sub.label}</option>
                        ))}
                    </select>
                    <input name="name" placeholder="Име" value={values.name || ""} onChange={changeHandler} className="border p-2 w-full" />
                    <input name="manufacturer" placeholder="Производител" value={values.manufacturer || ""} onChange={changeHandler} className="border p-2 w-full" />
                    <input name="price" type="number" placeholder="Цена" value={values.price || ""} onChange={changeHandler} className="border p-2 w-full" />
                    <input name="discountPrice" type="number" placeholder="Промо цена" value={values.discountPrice || ""} onChange={changeHandler} className="border p-2 w-full" />
                    <input name="quantity" type="number" placeholder="Налично количество" value={values.quantity || ""} onChange={changeHandler} className="border p-2 w-full" />
                    <input name="originCountry" placeholder="Страна на произход" value={values.originCountry || ""} onChange={changeHandler} className="border p-2 w-full" />
                    <input name="unitCount" type="number" placeholder="Брой в опаковка" value={values.unitCount || ""} onChange={changeHandler} className="border p-2 w-full" />
                    <input name="unitType" placeholder="Тип единица" value={values.unitType || ""} onChange={changeHandler} className="border p-2 w-full" />
                    <label className="flex items-center space-x-2 md:col-span-2">
                        <input type="checkbox" name="isFeatured" checked={values.isFeatured || false} onChange={changeHandler} />
                        <span>Показвай като препоръчан</span>
                    </label>

                    <textarea name="description" placeholder="Описание" value={values.description || ""} onChange={changeHandler} className="border p-2 w-full md:col-span-2" rows={3} />
                    <input name="tags" placeholder="Тагове (разделени със запетая)" value={values.tags || ""} onChange={changeHandler} className="border p-2 w-full md:col-span-2" />
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                    <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700" disabled={pending}>
                        {editingProduct ? "Запази промените" : "Създай продукт"}
                    </button>
                    {editingProduct && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingProduct(null);
                                setProductView("list");
                            }}
                            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                        >
                            Откажи редакция
                        </button>
                    )}
                </div>
            </form>

        </div>
    )
}