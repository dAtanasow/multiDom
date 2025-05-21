import { Link } from "react-router";
import MobileNav from "../../navigation/mobile/MobileNav";
import CartButton from "../../buttons/CartButton";
import ProfileButton from "../../buttons/ProfileButton";
import MenuButton from "../../buttons/MenuButton";
import SearchButton from "../../buttons/SearchButton";
import AdminButton from "../../buttons/AdminButton";
import TagSearch from "../../search/TagSearch";

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
    <div className="md:hidden relative h-18 px-4 border-b shadow-sm bg-white">
      {/* Лявата част: меню и търсачка */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
        <MenuButton onClick={() => setMobileMenuOpen((prev) => !prev)} />
        <SearchButton onClick={() => setShowSearch((prev) => !prev)} />
      </div>

      {/* Центрирано лого */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Link to="/">
          <img src="/icons/мултиДом-logo.jpeg" alt="МултиДом" className="h-12" />
        </Link>
      </div>

      {/* Дясната част: админ, профил и количка */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
        <AdminButton />
        <ProfileButton />
        <CartButton />
      </div>

      {/* Мобилно меню */}
      {mobileMenuOpen && <MobileNav onClose={onClose} />}

      {/* Търсачка */}
      {showSearch && (
        <div className="absolute top-full left-0 w-full bg-white px-4 pb-2">
          <TagSearch onClose={() => setShowSearch(false)} />
        </div>
      )}
    </div>

  );
}