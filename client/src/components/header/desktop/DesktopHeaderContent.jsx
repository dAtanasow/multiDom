import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DesktopNav from "../../navigation/desktop/Navigation";
import CartButton from "../../buttons/CartButton";
import ProfileButton from "../../buttons/ProfileButton";
import AdminButton from "../../buttons/AdminButton";
import TagSearch from "../../search/TagSearch";
import { FiSearch } from "react-icons/fi";

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
      <div className="hidden md:block bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-12 items-center gap-6">

          {/* Logo */}
          <div className="col-span-2">
            <Link to="/">
              <img
                src="/icons/мултиДом-logo.jpeg"
                alt="МултиДом"
                className="w-[140px] h-auto"
              />
            </Link>
          </div>

          {/* Search Box */}
          <div className="col-span-8 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-xl">
              <div className="relative">
                <TagSearch />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1 text-center">
              Безплатна доставка за поръчки над 70 лв.
            </p>
          </div>

          {/* Actions */}
          <div className="col-span-2 flex items-center justify-end gap-4">
            <AdminButton />
            <ProfileButton />
            <CartButton />
          </div>
        </div>
      </div>

      {/* Scroll Hide/Show Navigation */}
      <div className={`transition-all duration-200 fixed top-26 w-full z-40 bg-white shadow ${hideNav ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}>
        <div className="max-w-full mx-auto px-4">
          <DesktopNav />
        </div>
      </div>
    </>
  );
}
