import { Link } from "react-router";

export default function Welcome() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white px-4 bg-black/40">
      <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold drop-shadow-lg leading-tight">
        За чист и уютен дом
      </h1>
      <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-200 drop-shadow">
        Препарати, козметика и хигиена на достъпни цени.
      </p>
      <Link
        to="/catalog"
        className="mt-5 sm:mt-6 inline-block bg-blue-600 hover:bg-blue-700 transition px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium text-sm sm:text-base uppercase tracking-wide shadow"
      >
        Разгледай продукти
      </Link>
    </div>
  );
}
