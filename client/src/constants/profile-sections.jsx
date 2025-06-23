import { FiUser, FiPackage, FiHeart, FiFileText } from "react-icons/fi";

export const sections = [
    { key: "details", label: "Детайли", icon: <FiUser />, path: "/profile/details" },
    { key: "orders", label: "Поръчки", icon: <FiPackage />, path: "/profile/orders" },
    { key: "favorites", label: "Любими", icon: <FiHeart />, path: "/profile/favorites" },
    { key: "addresses", label: "Адреси", icon: <FiFileText />, path: "/profile/addresses" },
];