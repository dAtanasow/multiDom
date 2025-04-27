import { Link } from "react-router";

export default function BestSellers() {
  return (
    <section className="bg-gray-100 py-12 px-4 md:px-12">
      <h2 className="text-2xl font-semibold text-center mb-8">
        Най-продавани продукти
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          {
            name: "Превръзки Johnson & Johnson",
            image: "/products/johnson.jpg",
            href: "/product/prevrazki-johnson",
          },
          {
            name: "Пелени Hayat",
            image: "/products/hayat.jpg",
            href: "/product/peleni-hayat",
          },
          {
            name: "Кърпички HighGenic",
            image: "/products/highgenic.jpg",
            href: "/product/karpichki-highgenic",
          },
          {
            name: "Фурна Bosch",
            image: "/products/furnabosch.jpg",
            href: "/product/furna-bosch",
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
