import { useEffect, useState } from "react";
import { useForm } from "./useForm";
import productApi from "../api/catalog";
import navLinks from "../utils/navLinks";
import adminApi from "../api/admin";

export function useProductsAdmin() {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);

    const fetchProducts = async () => {
        const res = await productApi.getAll();
        setProducts(res.products || []);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const {
        values,
        changeHandler,
        submitHandler,
        setValues,
        setError,
        pending,
    } = useForm(
        {
            name: "",
            images: [],
            price: "",
            category: "",
            subCategory: "",
            description: "",
            tags: "",
            manufacturer: "",
        },
        async (values) => {

            console.log("Submitting product:", values);

            const processed = {
                ...values,
                tags: values.tags
                    .split(",")
                    .map(tag => tag.trim())
                    .filter(tag => tag !== ""),
            };


            if (editingProduct) {
                await productApi.update(editingProduct._id, processed);
                setEditingProduct(null);
            } else {
                await adminApi.create(processed);
            }

            fetchProducts();
            setValues({
                name: "",
                images: [],
                price: "",
                category: "",
                subCategory: "",
                description: "",
                tags: "",
                manufacturer: "",
            });
        },
        { reinitializeForm: false }
    );

    const handleEdit = (product) => {
        setEditingProduct(product);
        setValues({
            name: product.name,
            images: product.images || [],
            price: product.price,
            category: product.category,
            subCategory: product.subCategory,
            description: product.description || "",
            tags: (product.tags || []).join(", "),
            manufacturer: product.manufacturer || "",
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Сигурни ли сте, че искате да изтриете този продукт?")) {
            await productApi.del(id);
            fetchProducts();
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setValues((prev) => ({
                ...prev,
                images: [...(prev.images || []), reader.result],
            }));
        };
        reader.readAsDataURL(file);
    };

    const removeImage = (indexToRemove) => {
        setValues((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== indexToRemove),
        }));
    };

    return {
        products,
        values,
        pending,
        editingProduct,
        navLinks,
        changeHandler,
        submitHandler,
        handleEdit,
        handleDelete,
        handleImageUpload,
        removeImage,
    };
}
