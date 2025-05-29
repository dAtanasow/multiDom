import { useEffect, useState } from "react";
import Welcome from "../welcome/Welcome";

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

  return (
    <div className="relative md:mt-10 w-full mx-auto h-[550px] overflow-hidden shadow-lg">
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Slide ${index}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
        />
      ))}

      <Welcome />
    </div>
  )
}