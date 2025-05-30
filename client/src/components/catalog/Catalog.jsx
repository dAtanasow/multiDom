import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  useCatalog,
  useCatalogFilters,
} from "../../hooks/useCatalog";
import navLinks from "../../utils/navLinks";
import ProductCard from "./product-card/ProductCard";
import SpinnerLoader from "../SpinnerLoader";

export default function Catalog() {
  const { products, loading } = useCatalog();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const {
    sortOption,
    setSortOption,
    selectedCategories,
    toggleCategory,
    clearFilters,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    sortedProducts,
  } = useCatalogFilters(products);

  const handleSubCategoryToggle = (label) => {
    const newParams = new URLSearchParams(searchParams);
    const isSelected = selectedCategories.includes(label);
    const newSelected = isSelected
      ? selectedCategories.filter((l) => l !== label)
      : [...selectedCategories, label];

    newParams.delete("category");

    if (newSelected.length === 1) {
      newParams.set("subCategory", newSelected[0]);
    } else {
      newParams.delete("subCategory");
    }

    navigate(`/catalog?${newParams.toString()}`);
    toggleCategory(label);
    setMobileFiltersOpen(false);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / itemsPerPage));

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 md:p-8 md:mt-15 xl:mt-12 overflow-x-hidden">

      <aside className="hidden md:block w-full md:w-1/4 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Филтри</h2>
        <div className="space-y-4">
          {navLinks.map((cat) => (
            <div key={cat.label}>
              <h3 className="font-semibold text-gray-700 mb-2">{cat.label}</h3>
              <div className="space-y-2 ml-2">
                {cat.subLinks?.map((sub) => (
                  <label key={sub.label} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={selectedCategories.includes(sub.label)}
                      onChange={() => handleSubCategoryToggle(sub.label)}
                    />
                    {sub.label}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={clearFilters}
          className="mt-6 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
        >
          Изчисти филтрите
        </button>
      </aside>

      <main className="flex-1">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 flex-wrap">
          <h1 className="text-2xl font-bold text-gray-800">Каталог</h1>

          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-sm text-gray-500">
              Намерени продукти: {sortedProducts.length}
            </p>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 text-sm"
            >
              <option value="newest">Най-нови</option>
              <option value="price-low">Цена: Ниска към висока</option>
              <option value="price-high">Цена: Висока към ниска</option>
            </select>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg p-2 text-sm"
            >
              <option value={12}>12 на страница</option>
              <option value={24}>24 на страница</option>
              <option value={48}>48 на страница</option>
            </select>
          </div>
        </div>

        {loading ? (
          <SpinnerLoader />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 overflow-x-hidden max-w-full">
              {paginatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
              {sortedProducts.length === 0 && !loading && (
                <p className="col-span-full text-center text-gray-600">
                  Няма намерени продукти.
                </p>
              )}
            </div>
            <div className="flex justify-center mt-6 gap-2 flex-wrap items-center">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border text-sm disabled:opacity-50"
              >
                Назад
              </button>
              <span className="text-sm text-gray-600">
                Страница {totalPages === 0 ? 1 : currentPage} от {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 py-1 rounded border text-sm disabled:opacity-50"
              >
                Напред
              </button>
            </div>
          </>
        )}
      </main >

      < div
        className={`fixed inset-0 z-50 flex justify-end transition-transform duration-300 ${mobileFiltersOpen ? "translate-x-0" : "translate-x-full"
          }`
        }
      >
        <div className="bg-white w-3/4 h-full p-6 overflow-y-auto shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Филтри</h2>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="text-gray-700 hover:text-red-500 text-2xl"
            >
              &times;
            </button>
          </div>
          <div className="space-y-4">
            {navLinks.map((cat) => (
              <div key={cat.label}>
                <h3 className="font-semibold text-gray-700 mb-2">{cat.label}</h3>
                <div className="space-y-2 ml-2">
                  {cat.subLinks?.map((sub) => (
                    <label key={sub.label} className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={selectedCategories.includes(sub.label)}
                        onChange={() => handleSubCategoryToggle(sub.label)}
                      />
                      {sub.label}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              clearFilters();
              setMobileFiltersOpen(false);
            }}
            className="mt-6 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
          >
            Изчисти филтрите
          </button>
        </div>
      </div >
    </div >
  );
}
