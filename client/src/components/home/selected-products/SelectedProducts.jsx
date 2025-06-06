import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductCard from "../../catalog/product-card/ProductCard";
import catalogApi from "../../../api/catalog";
import DotsLoader from "../../DotsLoader";

export default function SelectedProducts() {
  const [products, setProducts] = useState();
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
        const data = await catalogApi.getFeatured(8);
        setProducts(data.products);
      } catch (err) {
        console.error("Грешка при зареждане на препоръчани продукти:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="w-full relative">
      <div className="max-w-screen-xl mx-auto px-4">
        <h2 className="text-2xl font-medium text-center mb-8">Препоръчани продукти</h2>

        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <DotsLoader />
          </div>
        ) : products?.length > 0 ? (
          <div className="relative w-full">
            <button
              onClick={() => scroll("left")}
              className="hidden sm:flex absolute top-1/2 left-2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow hover:bg-gray-200 transition"
            >
              <FiChevronLeft />
            </button>

            <div
              ref={scrollRef}
              className="scroll-container flex gap-3 overflow-x-auto"
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
              className="hidden sm:flex absolute top-1/2 right-2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow hover:bg-gray-200 transition"
            >
              <FiChevronRight />
            </button>

          </div>
        ) : (
          <p className="text-center text-gray-500">Няма налични продукти.</p>
        )}
      </div>
    </div>
  );
}
