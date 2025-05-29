import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductCard from "../../catalog/product-card/ProductCard";
import catalogApi from "../../../api/catalog";

export default function SelectedProducts() {
  const [products, setProducts] = useState();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await catalogApi.getFeatured(8);
        setProducts(data.products);
      } catch (err) {
        console.error("Грешка при зареждане на препоръчани продукти:", err);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await catalogApi.getNewest(8);
        setProducts(data.products);
      } catch (err) {
        console.error("Грешка при зареждане на нови продукти:", err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold text-center mb-4">Препоръчани продукти</h2>

      <div className="flex items-center max-w-screen-xl mx-auto md:px-4">
        <button
          onClick={() => scroll("left")}
          className="absolute top-40 left-0 xl:left-10 z-50 p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-xl"
        >
          <FiChevronLeft />
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 scrollbar-hide scroll-smooth px-2"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {products?.map((product) => (
            <div
              key={product._id}
              className="flex-shrink-0 w-[240px] snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute top-40 right-0 xl:right-10 z-50 p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-xl"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>

  );
}