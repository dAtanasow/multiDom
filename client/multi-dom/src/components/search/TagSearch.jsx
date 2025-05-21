import { useState, useEffect } from "react";
import catalogApi from "../../api/catalog";
import { useLocation, useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

export default function TagSearch({ onClose }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate()
    const location = useLocation();

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
        }
        if (searchTerm) {
            fetchProducts();
        }
    }, [searchTerm])

    useEffect(() => {
        if (searchTerm === "") {
            setFilteredProducts(products);
        } else {
            const lowercasedTerm = searchTerm.toLowerCase();
            const filtered = products.filter(product =>
                product.tags.some(tag => tag.toLowerCase().includes(lowercasedTerm))
            );
            setFilteredProducts(filtered);
        }
    }, [searchTerm, products]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const onSearch = (e) => {
        e.preventDefault();
        navigate(`/catalog?search=${encodeURIComponent(searchTerm)}`)
        if (onClose) onClose();
    }

    return (
        <div>
            <form onSubmit={onSearch}>
                <input
                    type="text"
                    placeholder="Търси..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-2 mt-2 border rounded-xl border-gray-300 focus:outline-none"
                />
            </form>
            <AnimatePresence>
                {searchTerm && filteredProducts.length > 0 && (
                    <motion.ul
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white mt-2 border border-gray-200 rounded-2xl shadow-lg max-h-72 overflow-y-auto divide-y divide-gray-100 z-50"
                    >
                        {filteredProducts.map(product => (
                            <Link
                                key={product._id}
                                to={`/catalog/${product._id}`}
                                className="block"
                                onClick={onClose}
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
                {searchTerm && filteredProducts.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mt-2 bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-500 text-center shadow"
                    >
                        Няма съвпадения
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
