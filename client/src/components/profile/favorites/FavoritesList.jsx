import { useEffect, useState } from "react";
import ProductCard from "../../catalog/product-card/ProductCard";
import profileApi from "../../../api/profile";

export default function FavoritesList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                setLoading(true);
                const data = await profileApi.getFavoriteProducts();
                setProducts(data);
            } catch (err) {
                console.error("Грешка при зареждане на любими:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    if (loading) {
        return <p className="text-center text-gray-500">Зареждане на любими...</p>;
    }

    if (products.length === 0) {
        return <p className="text-center text-gray-500">Нямате добавени любими продукти.</p>;
    }
    return (
        <div className="mb-6 md:mt-15 xl:my-10">
            <h3 className="text-2xl font-semibold text-center mb-6">❤️ Любими продукти</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
}