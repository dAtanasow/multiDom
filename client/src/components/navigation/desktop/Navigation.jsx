import { NavLink } from "react-router";
import navLinks from "../../../utils/navLinks";

export default function DesktopNav() {
  return (
    <nav className="p-2 relative">
      <div className="hidden md:flex flex-wrap justify-center gap-x-6 gap-y-2 text-gray-700 font-medium">
        {navLinks.map((link) => (
          <div key={link.label} className="relative group">
            <NavLink
              to={link.href}
              className="whitespace-nowrap hover:text-blue-600 transition"
            >
              {link.label}
            </NavLink>

            {link.subLinks && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-all duration-300 min-w-[160px] z-50">
                <div className="flex flex-col py-2">
                  {link.subLinks.map((subLink) => (
                    <NavLink
                      key={subLink.label}
                      to={subLink.href}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition whitespace-nowrap text-sm"
                    >
                      {subLink.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
