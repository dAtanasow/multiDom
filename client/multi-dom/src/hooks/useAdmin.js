import { useEffect, useState } from "react";
import { useForm } from "./useForm";
import productApi from "../api/catalog";
import navLinks from "../utils/navLinks";
import adminApi from "../api/admin";
import { toast } from "react-toastify";
import { confirmAlert } from 'react-confirm-alert';

export function useProductsAdmin() {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);

    const fetchProducts = async () => {
        try {
            const res = await productApi.getAll();
            setProducts(res.products || []);
        } catch (err) {
            toast.error("Грешка при зареждане на продуктите.");
        }
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
            manufacturer: ""

        },
        async (values) => {
            const { name, price, category, subCategory, manufacturer } = values;
            if (!name || !price || !category || !subCategory || !manufacturer) {
                toast.error("Моля, попълнете всички задължителни полета.");
                return;
            }

            const processed = {
                ...values,
                tags: values.tags.split(",").map(tag => tag.trim()).filter(tag => tag !== ""),
                images: values.images.filter(img => typeof img === "string" && img.startsWith("data:image")),
            };


            try {
                if (editingProduct) {
                    await adminApi.updateProduct(editingProduct._id, processed);
                    toast.success("Продуктът е обновен успешно.");
                    setEditingProduct(null);
                } else {
                    await adminApi.createProduct(processed);
                    toast.success("Продуктът е създаден успешно.");
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
            } catch (err) {
                toast.error("Възникна грешка при запазване.");
                setPending(false);
            }
        },
        { reinitializeForm: false }
    );

    const handleEdit = (product) => {
        setEditingProduct(product);
        setValues({
            name: product.name || "",
            images: product.images || [],
            price: product.price || "",
            category: product.category || "",
            subCategory: product.subCategory || "",
            description: product.description || "",
            tags: (product.tags || []).join(", "),
            manufacturer: product.manufacturer || "",
        });
    };


    const handleDelete = (id) => {
        confirmAlert({
            message: 'Сигурни ли сте, че искате да изтриете този продукт?',
            buttons: [
                {
                    label: 'Да',
                    onClick: async () => {
                        try {
                            await adminApi.deleteProduct(id);
                            toast.success('Продуктът беше изтрит успешно.');
                            fetchProducts();
                        } catch (err) {
                            toast.error('Възникна грешка при изтриване.');
                        }
                    },
                },
                {
                    label: 'Не',
                    onClick: () => {
                        toast.info('Изтриването беше отменено.');
                    },
                },
            ],
        });
    };


    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    setValues((prev) => ({
                        ...prev,
                        images: [...(prev.images || []), reader.result],
                    }));
                }
            };
            reader.readAsDataURL(file);
        });
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
