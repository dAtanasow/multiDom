import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import catalogApi from "../api/catalog";


export function useCatalog() {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const category = searchParams.get("category") || null;
    const subCategory = searchParams.get("subCategory") || null;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const query = new URLSearchParams();
<<<<<<< HEAD

                if (subCategory) {
                    query.append("subCategory", subCategory);
                } else if (category) {
                    query.append("category", category);
                }

                const data = await catalogApi.getAll(query.toString());

=======

                if (category) query.set("category", category);
                if (subCategory) query.set("subCategory", subCategory);

                const data = await catalogApi.getAll(query.toString());

>>>>>>> 54ae910df94b8acb42d1289b45b40089f9162e8b
                const resolved = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.products)
                        ? data.products
                        : [];

                setProducts(resolved);
            } catch (err) {
                console.error("Грешка при зареждане на продукти:", err.message);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category, subCategory]);

    return { products, loading, category, subCategory };
}

export function useCatalogFilters(products = []) {
    const [sortOption, setSortOption] = useState("newest");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const toggleCategory = (label) => {
        setSelectedCategories((prev) =>
            prev.includes(label)
                ? prev.filter((item) => item !== label)
                : [...prev, label]
        );
    };

    const clearFilters = () => setSelectedCategories([]);

    const sortedProducts = useMemo(() => {
<<<<<<< HEAD
        let filtered = [...products];

        if (selectedCategories.length > 0) {
            filtered = filtered.filter((p) =>
                selectedCategories.includes(p.subCategory)
            );
        }
=======
        let filtered = selectedCategories.length
            ? products.filter((p) => selectedCategories.includes(p.subCategory))
            : [...products];
>>>>>>> 54ae910df94b8acb42d1289b45b40089f9162e8b

        switch (sortOption) {
            case "price-low":
                return filtered.sort((a, b) => a.price - b.price);
            case "price-high":
                return filtered.sort((a, b) => b.price - a.price);
            case "newest":
            default:
                return filtered.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
        }
    }, [products, selectedCategories, sortOption]);

    return {
        sortOption,
        setSortOption,
        selectedCategories,
        toggleCategory,
        clearFilters,
        mobileFiltersOpen,
        setMobileFiltersOpen,
        sortedProducts,
    };
}

export function useProductDetails(productId) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await catalogApi.getById(productId);
                setProduct(data);
                setActiveImage(data.images?.[0] || null);
            } catch (err) {
                console.error("Грешка при зареждане на продукта:", err.message);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId]);

    useEffect(() => {
        const fetchRelated = async () => {
            if (product?.subCategory) {
                try {
                    const query = new URLSearchParams({ subCategory: product.subCategory }).toString();
                    const all = await catalogApi.getAll(query);
                    const products = Array.isArray(all) ? all : all.products || [];
                    const filtered = products.filter(p => p._id !== product._id).slice(0, 4);
                    setRelatedProducts(filtered);
                } catch (err) {
                    console.error("Грешка при зареждане на свързани продукти:", err.message);
                }
            }
        };

        fetchRelated();
    }, [product]);

    return {
        product,
        loading,
        activeImage,
        setActiveImage,
        relatedProducts
    };
}
