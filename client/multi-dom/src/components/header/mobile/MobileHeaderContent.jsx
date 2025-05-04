import { Link } from "react-router";
import MobileNav from "../../navigation/mobile/MobileNav";
import CartButton from "../../buttons/CartButton";
import ProfileButton from "../../buttons/ProfileButton";
import MenuButton from "../../buttons/MenuButton";
import SearchButton from "../../buttons/SearchButton";
import AdminButton from "../../buttons/AdminButton";

export default function MobileHeaderContent({
  setMobileMenuOpen,
  setShowSearch,
  showSearch,
  mobileMenuOpen,
}) {

  const onClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="md:hidden flex items-center justify-between p-4 relative">
      <div className="flex items-center gap-3">
        <MenuButton onClick={() => setMobileMenuOpen((prev) => !prev)} />

        <SearchButton onClick={() => setShowSearch((prev) => !prev)} />
      </div>

      <div className="flex-shrink-0">
        <Link to="/">
          <img src="icons/мултиДом-logo.jpeg" alt="МултиДом" className="w-40" />
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <AdminButton />

        <ProfileButton />

        <CartButton />
      </div>

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