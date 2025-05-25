import { useProductsTable } from "../../../hooks/useAdmin";

export default function ProductsTable({ setProductView, setEditingProduct }) {
  const { products, handleDelete } = useProductsTable();

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setProductView("create");
  };

  return (
    <div className="pb-2 pt-2 w-full">
      <div className="overflow-x-auto">
        <div className="min-w-[700px] w-full border rounded-lg">
          <table className="w-full text-sm text-center border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="border px-2 py-2">Снимка</th>
                <th className="border px-2 py-2">Име</th>
                <th className="border px-2 py-2">Цена</th>
                <th className="border px-2 py-2">Промо</th>
                <th className="border px-2 py-2">Налични</th>
                <th className="border px-2 py-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="border px-2 py-2 align-middle">
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="w-16 h-16 object-contain mx-auto"
                    />
                  </td>
                  <td className="border px-2 py-2">{product.name}</td>
                  <td className="border px-2 py-2">
                    {product.price?.toFixed(2)}
                  </td>
                  <td className="border px-2 py-2">
                    {product.discountPrice ? (
                      <span className="text-green-600 font-semibold bg-green-100 px-1 rounded">
                        {product.discountPrice.toFixed(2)}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td
                    className={`border px-2 py-2 ${product.quantity < 10
                        ? "bg-yellow-100 text-yellow-800 font-semibold"
                        : ""
                      }`}
                  >
                    {product.quantity}
                  </td>
                  <td className="border px-2 py-2">
                    <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-2">
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                        onClick={() => handleEditClick(product)}
                      >
                        Редактирай
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                        onClick={() => handleDelete(product._id)}
                      >
                        Изтрий
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
