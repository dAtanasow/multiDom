import { Link, useNavigate, useSearchParams } from "react-router";
import {
  useCatalog,
  useCatalogFilters,
} from "../../hooks/useCatalog";
import navLinks from "../../utils/navLinks";
import { useCartContext } from "../../context/CartContext";
import { toast } from "react-toastify";
import ProductCard from "../product-card/ProductCard";

export default function Catalog() {
  const { products, loading } = useCatalog();
  const { addToCart } = useCartContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 md:p-8 overflow-x-hidden">

      {/* Sidebar filters */}
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

      {/* Main content */}
      <main className="flex-1">
        {/* Top bar: title + filters + sort */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">

          {/* Title and filter button */}
          <div className="flex items-center justify-between w-full">
            <h1 className="text-2xl font-bold text-gray-800">Каталог</h1>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden bg-blue-600 text-white py-1.5 px-3 rounded-md text-sm hover:bg-blue-700 transition"
            >
              Филтрирай
            </button>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500 mt-1">
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
          </div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 overflow-x-hidden max-w-full">
          {sortedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
          {sortedProducts.length === 0 && (
            <p className="col-span-full text-center text-gray-600">
              Няма намерени продукти.
            </p>
          )}
        </div>
      </main >

      {/* Mobile Filters SlideOver */}
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
