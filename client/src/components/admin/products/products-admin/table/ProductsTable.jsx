import { useState, useRef, useEffect } from "react";
import { useProductsTable } from "../../../../../hooks/useAdmin";
import GenericSearch from "../../../../search/GenericSearch";
import SpinnerLoader from "../../../../SpinnerLoader";

export default function ProductsTable({ setProductView, setEditingProduct }) {
  const { products, handleDelete, loading } = useProductsTable();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const tableRef = useRef(null);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setProductView("create");
  };

  useEffect(() => {
    if (tableRef.current) {
      window.scrollTo({ top: tableRef.current.offsetTop - 80, behavior: "smooth" });
    }
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) return <SpinnerLoader />;

  return (
    <div className="w-full overflow-x-auto mt-2 border rounded-lg" ref={tableRef}>
      <GenericSearch
        data={products}
        keys={["productNumber", "name"]}
        term={searchTerm}
        className="w-full"
      >
        {(filteredProducts) => {
          const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
          const startIndex = (currentPage - 1) * itemsPerPage;
          const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

          return (
            <>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-4">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Търси по име или номер..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border rounded-xl border-gray-300 focus:outline-none w-full sm:w-[300px] text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">На страница:</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border text-sm rounded px-2 py-1"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              <div className="w-full overflow-x-auto">
                <table className="w-full text-sm text-center border-collapse table-auto">
                  <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="border px-2 py-2 w-[80px]">Номер</th>
                      <th className="border px-2 py-2 w-[100px]">Снимка</th>
                      <th className="border px-2 py-2 min-w-[200px]">Име</th>
                      <th className="border px-2 py-2 w-[90px]">Цена</th>
                      <th className="border px-2 py-2 w-[90px]">Промо</th>
                      <th className="border px-2 py-2 w-[90px]">Налични</th>
                      <th className="border px-2 py-2 min-w-[130px]">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="border px-2 py-2">{product.productNumber}</td>
                        <td className="border px-2 py-2">
                          <img
                            src={product.images?.[0]}
                            alt={product.name}
                            className="w-12 h-12 object-contain mx-auto"
                          />
                        </td>
                        <td className="border px-2 py-2 break-words">{product.name}</td>
                        <td className="border px-2 py-2">{product.price?.toFixed(2)}</td>
                        <td className="border px-2 py-2">
                          {product.discountPrice ? (
                            <span className="text-green-600 font-semibold bg-green-100 px-1 rounded">
                              {product.discountPrice.toFixed(2)}
                            </span>
                          ) : "-"}
                        </td>
                        <td className={`border px-2 py-2 ${product.quantity < 10 ? "bg-yellow-100 text-yellow-800 font-semibold" : ""}`}>
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

              {filteredProducts.length === 0 && (
                <p className="text-center text-sm text-gray-500 mt-4">Няма съвпадения</p>
              )}

              {totalPages > 1 && (
                <div className="flex justify-center my-3 flex-wrap gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                  >
                    Назад
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded border text-sm ${currentPage === page
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100"
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border text-sm disabled:opacity-50"
                  >
                    Напред
                  </button>
                </div>
              )}
            </>
          );
        }}
      </GenericSearch>
    </div>
  );
}
