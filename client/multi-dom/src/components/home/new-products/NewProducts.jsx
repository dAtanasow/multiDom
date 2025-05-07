import { useEffect, useState } from "react";
import { Link } from "react-router";
import catalogApi from "../../../api/catalog";

export default function NewProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    catalogApi
      .getNewest("limit=4")
      .then((res) => setProducts(res.products || []))
      .catch((err) => {
        console.error("Грешка при зареждане на новите продукти:", err);
      });
  }, []);

  return (
    <section className="bg-gray-100 py-12 px-4 md:px-12">
      <h2 className="text-2xl font-semibold text-center mb-8">Нови продукти</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/catalog/${product._id}`}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <img
              src={product.images?.[0] || "/images/placeholder.jpg"}
              alt={product.name}
              className="w-full h-40 object-contain mb-4"
            />
            <h3 className="text-sm font-medium text-gray-800">
              {product.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}

