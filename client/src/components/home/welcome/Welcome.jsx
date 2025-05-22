import { Link } from "react-router";

export default function Welcome() {
  return (
    <section className="relative h-[400px] bg-cover bg-center flex items-center justify-center">
      <div className="bg-white bg-opacity-80 p-6 rounded-md text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Всичко за чистия и уютен дом
        </h1>
        <p className="mt-4 text-gray-600">
          Перилни и почистващи препарати, козметика и още.
        </p>
        <Link
          to="/catalog"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Разгледай продукти
        </Link>
      </div>
    </section>
  );
}
