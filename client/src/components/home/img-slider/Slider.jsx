import { useEffect, useState } from "react";

const images = [
  "/images/плочки2.jpg",
  "/images/стъкло4.webp",
  "/images/стъкло5.jpg",
  "/images/стъкло6.jpg",
  "/images/стъкло7.jpg",
  "/images/фурна.webp",
  "/images/параван.webp",
  "/images/камина.png",
];

export default function Slider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full xl:w-3/5 md:w-4/5 mx-auto h-[500px] overflow-hidden">
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Slide ${index}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white text-gray-800 rounded-full p-2 transition"
      >
        ◀
      </button>

      {/* Стрелка надясно */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/50 hover:bg-white text-gray-800 rounded-full p-2 transition"
      >
        ▶
      </button>
    </div>
  );
}
