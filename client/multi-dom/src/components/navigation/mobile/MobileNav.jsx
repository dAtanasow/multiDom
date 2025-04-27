import navLinks from "../../../utils/navLinks";
import { NavLink } from "react-router";

export default function MobileNav({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="w-4/5 bg-white p-6 shadow-md h-full animate-slide-in-right overflow-y-auto">
        <div className="flex justify-end">
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
        <nav className="flex flex-col space-y-4 mt-6 text-gray-800 font-medium">
          {navLinks.map((link) => (
            <NavLink
              className="hover:text-blue-600 transition"
              onClick={onClose}
              key={link.label}
              href={link.href}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div
        onClick={onClose}
        className="w-1/5 h-full"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
      ></div>
    </div>
  );
}
