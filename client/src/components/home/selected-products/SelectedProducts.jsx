import { useEffect, useState } from "react";
import catalogApi from "../../../api/catalog";
import ProductCard from "../../catalog/product-card/ProductCard";

export default function SelectedProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await catalogApi.getFeatured(4);
        setProducts(data.products);
      } catch (err) {
        console.error("Грешка при зареждане на препоръчани продукти:", err);
      }
    };

    fetchProducts();
  }, []);
  return (
    <section className="bg-gray-100 py-12 px-4 md:px-12">
      <h2 className="text-2xl font-semibold text-center mb-8">
        Препоръчани продукти
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
