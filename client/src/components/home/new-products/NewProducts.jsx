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
    <div className="relative w-full">
      <div className="max-w-screen-xl mx-auto px-4 relative overflow-hidden">
        <h2 className="text-2xl font-medium text-center mb-8">Нови продукти</h2>

        {loading ? (
          <DotsLoader />
        ) : (
          <div className="relative w-full">
            <button
              onClick={() => scroll("left")}
              className="hidden sm:flex absolute top-1/2 -translate-y-1/2 left-2 z-10 p-2 bg-white rounded-full shadow hover:bg-gray-200 transition"
            >
              <FiChevronLeft />
            </button>

            <div
              ref={scrollRef}
              className="w-full max-w-full flex overflow-x-auto gap-4 scroll-smooth scrollbar-hide snap-x snap-mandatory"
            >
              {products.map((product) => (
                <div
                  key={product._id}
                  className="flex-shrink-0 snap-start w-[240px]"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <button
              onClick={() => scroll("right")}
              className="hidden sm:flex absolute top-1/2 -translate-y-1/2 right-2 z-10 p-2 bg-white rounded-full shadow hover:bg-gray-200 transition"
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}