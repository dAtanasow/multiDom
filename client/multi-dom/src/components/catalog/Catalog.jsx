import { useState } from "react";

const products = [
  {
    id: 1,
    name: "Омекотител Mexon",
    price: 8.99,
    image: "/products/mexon.jpg",
  },
  { id: 2, name: "Пелени Hayat", price: 12.5, image: "/products/hayat.jpg" },
  {
    id: 3,
    name: "Кърпички HighGenic",
    price: 5.99,
    image: "/products/highgenic.jpg",
  },
  {
    id: 4,
    name: "Превръзки Johnson",
    price: 7.5,
    image: "/products/johnson.jpg",
  },
  {
    id: 5,
    name: "Фурна Bosch",
    price: 499.99,
    image: "/products/furnabosch.jpg",
  },
];

export default function Catalog() {
  const [sortOption, setSortOption] = useState("newest");

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === "price-low") return a.price - b.price;
    if (sortOption === "price-high") return b.price - a.price;
    return b.id - a.id;
  });

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 md:p-8">
      {/* Sidebar filters */}
      <aside className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Филтри</h2>
        <div className="space-y-3">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" /> Перилни препарати
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" /> Почистващи препарати
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" /> Козметика
          </label>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        {/* Sort options */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Каталог</h1>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-gray-300 rounded-lg p-2"
          >
            <option value="newest">Най-нови</option>
            <option value="price-low">Цена: Ниска към висока</option>
            <option value="price-high">Цена: Висока към ниска</option>
          </select>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition flex flex-col"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-40 object-contain mb-4"
              />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {product.name}
              </h3>
              <p className="text-blue-600 font-semibold">
                {product.price.toFixed(2)} лв.
              </p>
              <button className="mt-auto bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mt-4">
                Добави в количката
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
