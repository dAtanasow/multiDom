import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductCard from "../../catalog/product-card/ProductCard";
import catalogApi from "../../../api/catalog";
import DotsLoader from "../../DotsLoader";

export default function NewProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await catalogApi.getNewest(8);
        setProducts(data.products);
      } catch (err) {
        console.error("Грешка при зареждане на нови продукти:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="relative max-w-screen-xl mx-auto px-4">
      <h2 className="text-2xl font-bold text-center mb-6">Нови продукти</h2>

      {loading ? (
        <DotsLoader />
      ) : (
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute top-1/2 -translate-y-1/2 left-0 xl:-left-6 z-10 p-2 bg-white rounded-full shadow hover:bg-gray-200 transition"
          >
            <FiChevronLeft />
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 scrollbar-hide scroll-smooth px-2"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {products.map((product) => (
              <div key={product._id} className="flex-shrink-0 w-[240px] snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute top-1/2 -translate-y-1/2 right-0 xl:-right-6 z-10 p-2 bg-white rounded-full shadow hover:bg-gray-200 transition"
          >
            <FiChevronRight />
          </button>
        </div>
      )}

      {!loading && products.length === 0 && (
        <p className="text-center text-gray-600 mt-4">Няма намерени продукти.</p>
      )}
    </div>
  );
}
