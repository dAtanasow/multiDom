import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import productApi from "../api/catalog";


export function useCatalog() {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const category = searchParams.get("category");
    const subCategory = searchParams.get("subCategory");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                const query = new URLSearchParams();
                if (category) query.append("category", category);
                if (subCategory) query.append("subCategory", subCategory);

                const data = await productApi.getAll(query.toString());
                if (Array.isArray(data)) {
                    setProducts(data);
                } else if (Array.isArray(data.products)) {
                    setProducts(data.products);
                } else {
                    setProducts([]);
                }

            } catch (err) {
                console.error("Грешка при зареждане на продукти:", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category, subCategory]);

    return {
        products,
        loading,
        category,
        subCategory,
    };
}

export function useCatalogFilters(products) {
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
        let filtered = [...products];

        if (selectedCategories.length > 0) {
            filtered = filtered.filter((p) => selectedCategories.includes(p.subCategory));
        }

        switch (sortOption) {
            case "price-low":
                filtered.sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                filtered.sort((a, b) => b.price - a.price);
                break;
            case "newest":
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            default:
                break;
        }

        return filtered;
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

