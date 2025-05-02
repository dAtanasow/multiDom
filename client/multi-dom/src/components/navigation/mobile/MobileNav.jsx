import { useState } from "react";
import navLinks from "../../../utils/navLinks";

export default function MobileNav({ onClose }) {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const navigationHandler = (href) => {
    onClose();
    window.location.href = href;
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="w-[70%] bg-white p-6 shadow-md h-full animate-slide-in-right overflow-y-auto">
        <div className="flex justify-between">
          <div>
            <p className="text-2xl font-bold">Категории</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-700 hover:text-red-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col space-y-4 mt-6 leading-10 text-gray-800 font-medium text-xl">
          {navLinks.map((link) => (
            <div key={link.label} className="flex flex-col">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigationHandler(link.href)}
                  className="text-left hover:text-blue-600 transition w-full"
                >
                  {link.label}
                </button>

                {link.subLinks && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleDropdown(link.label);
                    }}
                    className="ml-2 text-gray-600 hover:text-blue-600 transition"
                  >
                    {openDropdown === link.label ? "▲" : "▼"}
                  </button>
                )}
              </div>

              {openDropdown === link.label && link.subLinks && (
                <div className="ml-4 mt-2 flex flex-col space-y-2">
                  {link.subLinks.map((subLink) => (
                    <button
                      key={subLink.label}
                      onClick={() => navigationHandler(subLink.href)}
                      className="text-lg leading-8 hover:text-blue-500 transition text-left"
                    >
                      {subLink.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div
        onClick={onClose}
        className="w-[30%] h-full"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
      ></div>
    </div>
  );
}
