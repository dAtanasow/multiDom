import { useState } from "react";
import navLinks from "../../../utils/navLinks";
import { RiAppsLine } from "react-icons/ri";
import { useEffect } from "react";


export default function MobileNav({ onClose }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  const navigationHandler = (href) => {
    onClose();
    window.location.href = href;
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className={`w-[75%] max-w-xs bg-white h-full flex flex-col transform transition-transform duration-300 ease-in-out ${isClosing ? "-translate-x-full" : "translate-x-0"
          }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-bold tracking-wide text-gray-800 flex items-center gap-2">
            <RiAppsLine className="text-blue-600 w-6 h-6" />
            Категории
          </h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-red-500 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-4 text-base font-medium text-gray-700">
          {navLinks.map((link) => (
            <div key={link.label} className="space-y-1">
              <div className="flex items-center justify-between">
                <div
                  className={`w-[75%] max-w-xs bg-white h-full flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] transform ${isClosing ? "opacity-0 scale-95 -translate-x-4" : isVisible ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-95 translate-x-4"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    {link.icon && <link.icon className="text-blue-500 w-5 h-5" />}
                    <span>{link.label}</span>
                  </div>
                </div>
                {link.subLinks && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleDropdown(link.label);
                    }}
                    className="text-gray-400 hover:text-blue-500 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-4 h-4 transition-transform duration-200 ${openDropdown === link.label ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
              </div>

              {openDropdown === link.label && link.subLinks && (
                <div className="ml-4 pl-2 border-l border-blue-100">
                  {link.subLinks.map((subLink) => (
                    <button
                      key={subLink.label}
                      onClick={() => navigationHandler(subLink.href)}
                      className="block w-full text-left px-2 py-1 rounded hover:bg-blue-50 hover:text-blue-600 transition"
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
        onClick={handleClose}
        className={`flex-1 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? "opacity-0" : "opacity-100"
          } bg-white/10`}
      ></div>
    </div >
  );
}
