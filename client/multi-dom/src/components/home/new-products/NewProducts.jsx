import { Link } from "react-router";

export default function NewProducts() {
  return (
    <section className="bg-gray-100 py-12 px-4 md:px-12">
      <h2 className="text-2xl font-semibold text-center mb-8">Нови продукти</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          {
            name: "Омекотител Mexon",
            image: "/products/mexon.jpg",
            href: "/product/omekotitel-mexon",
          },
          {
            name: "Продукт 2",
            image: "/products/product2.jpg",
            href: "/product/product2",
          },
          {
            name: "Продукт 3",
            image: "/products/product3.jpg",
            href: "/product/product3",
          },
          {
            name: "Продукт 4",
            image: "/products/product4.jpg",
            href: "/product/product4",
          },
        ].map((product) => (
          <Link
            key={product.name}
            to={product.href}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <img
              src={product.image}
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
