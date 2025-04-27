import { NavLink } from "react-router";
import navLinks from "../../../utils/navLinks";

export default function DesktopNav() {
  return (
    <>
      <nav className="p-3">
        <div className="hidden md:flex flex-wrap justify-center gap-x-6 gap-y-2 text-gray-700 font-medium">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.href}
              className="whitespace-nowrap hover:text-blue-600 transition"
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
