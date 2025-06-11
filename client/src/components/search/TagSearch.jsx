import { useState, useEffect, useRef } from "react";
import catalogApi from "../../api/catalog";
import { useLocation, useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch } from "react-icons/fi";

export default function TagSearch({ onClose }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const inputRef = useRef(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const term = params.get("search") || "";
        setSearchTerm(term);
    }, [location.search]);

    useEffect(() => {

        const fetchProducts = async () => {
            try {
                const result = await catalogApi.getAll();
                setProducts(result.products || []);
            } catch (err) {
                console.log(err.message);
            }
        };
        if (searchTerm) {
            fetchProducts();
        }
    }, [searchTerm]);

    useEffect(() => {

        if (searchTerm === "") {
            setFilteredProducts(products);
        } else {
            const normalizeText = (text) =>
                text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

            const filtered = products.filter(product => {
                const search = normalizeText(searchTerm);
                return (
                    normalizeText(product.name).includes(search) ||
                    normalizeText(product.description).includes(search) ||
                    product.tags.some(tag => normalizeText(tag).includes(search))
                );
            });

            setFilteredProducts(filtered);
        }
    }, [searchTerm, products]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setShowDropdown(true);
    };

    const handleBlur = () => {
        setTimeout(() => setShowDropdown(false), 150);
    };

    const onSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/catalog?search=${encodeURIComponent(searchTerm)}`);
            setSearchTerm("");
            setShowDropdown(false);
            inputRef.current?.blur();
            if (onClose) onClose();
        }
    };

    return (
        <div className="relative w-full">
            <form onSubmit={onSearch} className="relative w-full">
                <div className="flex items-center max-w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl w-full mx-auto border border-gray-300 rounded-full">
                    <input
                        type="text"
                        placeholder="Търси..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onBlur={handleBlur}
                        ref={inputRef}
                        className="flex-grow px-4 py-2 text-sm focus:outline-none rounded-l-full"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 h-full flex items-center justify-center rounded-r-full"
                    >
                        <FiSearch className="text-white text-base" />
                    </button>
                </div>
            </form>
            <AnimatePresence>
                {searchTerm && showDropdown && filteredProducts.length > 0 && (
                    <motion.ul
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 right-0 w-full bg-white mt-2 border border-gray-200 rounded-2xl shadow-lg max-h-72 overflow-y-auto divide-y divide-gray-100 z-50"
                    >
                        {filteredProducts.map(product => (
                            <Link
                                key={product._id}
                                to={`/catalog/${product._id}`}
                                className="block"
                                onClick={() => {
                                    setShowDropdown(false);
                                    if (onClose) onClose();
                                }}
                            >
                                <li className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors">
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-10 h-10 rounded object-cover"
                                    />
                                    <span className="text-sm text-gray-800">{product.name}</span>
                                </li>
                            </Link>
                        ))}
                    </motion.ul>
                )}
                {searchTerm && showDropdown && filteredProducts.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute left-0 right-0 w-full mt-2 bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-500 text-center shadow"
                    >
                        Няма съвпадения
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
