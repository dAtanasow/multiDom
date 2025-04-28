import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/AuthContext";
import MobileNav from "../../navigation/mobile/MobileNav";

export default function MobileHeaderContent({
  setActivePanel,
  setMobileMenuOpen,
  setShowSearch,
  showSearch,
  mobileMenuOpen,
}) {
  const { accessToken } = useAuthContext();
  const navigate = useNavigate();

  const handleLoginButtonClick = () => {
    if (accessToken) {
      navigate("/profile");
    } else {
      setActivePanel((prev) => (prev === "login" ? null : "login"));
    }
  };

  const onClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="md:hidden flex items-center justify-between p-4 relative">
      {/* Left Side: Menu & Search icons */}
      <div className="flex items-center gap-3">
        <button onClick={() => setShowSearch((prev) => !prev)}>
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <button onClick={() => setShowSearch((prev) => !prev)}>
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
        </button>
      </div>

      {/* Center: Logo */}
      <div className="flex-shrink-0">
        <Link to="/">
          <img src="icons/мултиДом-logo.jpeg" alt="МултиДом" className="w-40" />
        </Link>
      </div>

      {/* Right Side: Login/Profile & Cart */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleLoginButtonClick}
          className="cursor-pointer px-3 py-2 rounded-xl hover:bg-blue-700 hover:text-white transition"
        >
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3A2.25 2.25 0 008.25 5.25V9m11.25 11.25v-1.5a2.25 2.25 0 00-2.25-2.25h-12a2.25 2.25 0 00-2.25 2.25v1.5M12 12a3 3 0 100-6 3 3 0 000 6z"
            />
          </svg>
        </button>

        {/* Cart button */}
        <button>
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386a.75.75 0 0 1 .728.573L5.82 9.75h12.41a.75.75 0 0 1 .73.928l-1.2 5a.75.75 0 0 1-.73.572H8.032a.75.75 0 0 1-.728-.572L5.227 4.5H3"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 16.5h.008v.008H16.5v-.008Zm-9 0h.008v.008H7.5v-.008Z"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && <MobileNav onClose={onClose} />}

      {showSearch && (
        <div className="absolute top-full left-0 w-full bg-white px-4 pb-2">
          <input
            type="text"
            placeholder="Търси продукт..."
            className="w-full px-4 py-2 border rounded-xl border-gray-300 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}