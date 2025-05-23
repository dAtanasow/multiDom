import { useState, useEffect } from "react";
import { Link } from "react-router";
import DesktopNav from "../../navigation/desktop/Navigation";
import CartButton from "../../buttons/CartButton";
import ProfileButton from "../../buttons/ProfileButton";
import AdminButton from "../../buttons/AdminButton";

export default function DesktopHeaderContent() {
  const [hideNav, setHideNav] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setHideNav(true);
      } else if (currentScrollY < lastScrollY) {
        setHideNav(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <div className="hidden md:block bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/">
              <img
                src="icons/мултиДом-logo.jpeg"
                alt="МултиДом"
                className="w-40"
              />
            </Link>
          </div>

          <div className="flex flex-col items-center flex-grow px-4">
            <div className="flex w-full max-w-md">
              <input
                type="text"
                placeholder="Търси продукт..."
                className="flex-grow px-4 py-2 border rounded-l-xl border-gray-300 focus:outline-none"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-r-xl hover:bg-blue-700 transition">
                Търси
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Безплатна доставка за поръчки над 70 лв.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <AdminButton />
            <ProfileButton />
            <CartButton />
          </div>
        </div>
      </div>

      {/* Навигацията ще се скрива при скрол */}
      <div className={`transition-all duration-300 fixed top-30 w-full z-50 bg-white shadow ${hideNav ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}>
        <div className="max-w-7xl mx-auto px-4">
          <DesktopNav />
        </div>
      </div>
    </>
  );
}

