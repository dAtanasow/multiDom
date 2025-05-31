import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Truck, ShieldCheck } from "lucide-react";
import { useProductDetails } from "../../hooks/useCatalog";
import { useCartContext } from "../../context/CartContext";
import { toast } from "react-toastify";
import ReviewList from "../reviews/ReviewList";
import useFavorites from "../../hooks/useFavorites";
import { normalizeProduct } from "../../utils/normalize";
import ProductCard from "../catalog/product-card/ProductCard";

export default function ProductDetails() {
    const { id } = useParams();
    const {
        product, loading, activeImage,
        averageRating, setActiveImage,
        relatedProducts, relatedLoading
    } = useProductDetails(id);
    const { addToCartContext } = useCartContext();
    const { isFavorite, toggleFavorite } = useFavorites();

    const handleAddToCart = async () => {
        try {
            await addToCartContext(normalizeProduct(product));
            toast.success("Продуктът беше добавен в количката.");
        } catch (err) {
            toast.error("Грешка при добавяне в количката:", err);
        }
    };


    if (loading) return <div className="p-10 text-center text-gray-500 text-lg animate-pulse">Зареждане...</div>;
    if (!product) return <div className="p-10 text-center text-red-500">Продуктът не е намерен.</div>;

    return (
        <motion.section className="max-w-7xl mx-auto px-4 py-12" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="grid md:grid-cols-2 mt-xl-between md:mt-10 gap-12">
                {/* Gallery */}
                <div className="space-y-5">
                    <div className="bg-white border rounded-3xl shadow-lg p-6">
                        <img
                            src={activeImage || "/placeholder.jpg"}
                            alt={product.name}
                            className="w-full h-[420px] object-contain transition-transform duration-300 hover:scale-105 rounded-2xl"
                        />
                    </div>
                    <div className="flex gap-4 overflow-x-auto">
                        {product.images?.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                onClick={() => setActiveImage(img)}
                                className={`h-20 w-20 object-contain border rounded-xl cursor-pointer transition-all duration-300 ${activeImage === img ? "ring-2 ring-blue-600" : "hover:shadow"}`}
                                alt={`Преглед ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Info */}
                <motion.div className="space-y-6" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <h1 className="text-4xl font-bold text-gray-900 leading-snug">{product.name}</h1>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3">
                            {product.discountPrice && product.discountPrice < product.price ? (
                                <>
                                    <p className="text-3xl text-green-600 font-extrabold">{product.discountPrice.toFixed(2)} лв.</p>
                                    <p className="text-lg text-gray-400 line-through">{product.price.toFixed(2)} лв.</p>
                                </>
                            ) : (
                                <p className="text-3xl text-green-600 font-extrabold">{product.price.toFixed(2)} лв.</p>
                            )}
                            <span className="text-sm text-gray-500">с вкл. ДДС</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={18} className={i < Math.round(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                        ))}
                        <span className="text-xs text-gray-500 ml-2">({averageRating.toFixed(1)} от 5)</span>
                    </div>


                    <ul className="text-sm text-gray-700 space-y-2">
                        <li><strong>Категория:</strong> {product.category}</li>
                        <li><strong>Подкатегория:</strong> {product.subCategory}</li>
                        <li><strong>Производител:</strong> {product.manufacturer}</li>
                        <li><strong>Количество:</strong> {product.unitCount} {product.unitType}</li>
                        <li><strong>Произход:</strong> {product.originCountry}</li>
                        <li><strong>Наличност:</strong> <span className="text-green-600 font-medium">В наличност</span></li>
                    </ul>

                    {product.tags?.length > 0 && (
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Тагове:</p>
                            <div className="flex flex-wrap gap-2">
                                {product.tags.map((tag, i) => (
                                    <span key={i} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full border border-blue-200">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-md">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Описание на продукта</p>
                        <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">{product.description}</p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleAddToCart}
                        className="bg-blue-600 m-1 hover:bg-blue-700 text-white text-base py-3 px-8 rounded-xl shadow-md transition self-start"
                    >
                        Добави в количката
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => toggleFavorite(product._id)}
                        className={"border m-1 text-base py-3 px-4 rounded-xl shadow-md transition bg-white border-gray-300 text-gray-700"}
                    >
                        {isFavorite(product._id) ? "🤍" : "❤️"}
                    </motion.button>

                    <div className="flex items-center gap-6 mt-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Truck size={20} className="text-blue-500" />
                            <span>Бърза доставка</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={20} className="text-green-500" />
                            <span>Оригинален продукт</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-10 xl:gap-15 mt-16">
                <div className="max-h-[600px] overflow-y-auto pr-2">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Отзиви</h2>
                    <ReviewList productId={id} />
                </div>

                {relatedProducts.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Свързани продукти</h2>
                        {relatedLoading ? (
                            <p className="text-sm text-gray-500 animate-pulse">Зареждане...</p>
                        ) : relatedProducts.length > 0 ? (
                            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-6">
                                {relatedProducts.map((item) => (
                                    <ProductCard key={item._id} product={item} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Няма свързани продукти</p>
                        )}
                    </div>
                )}
            </div>

        </motion.section >
    );
}
