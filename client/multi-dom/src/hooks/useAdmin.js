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
        pending,
        changeHandler,
        submitHandler,
        setValues,
        setError,
        setPending,
        appendImage
    } = useForm(
        {
            name: "",
            images: [],
            price: "",
            discountPrice: "",
            category: "",
            subCategory: "",
            description: "",
            tags: "",
            manufacturer: "",
            quantity: "",
            unitCount: "",
            unitType: "",
            originCountry: "",
            isFeatured: false,
        },
        async (values) => {
            console.log("Submit values:", values);
            const { name, price, category, subCategory, manufacturer } = values;
            if (!name || !price || !category || !subCategory || !manufacturer) {
                toast.error("Моля, попълнете всички задължителни полета.");
                return;
            }

            if (!values.images || !Array.isArray(values.images) || values.images.length === 0) {
                toast.error("Моля, добавете поне една снимка.");
                return;
            }

            if (values.price === "" || isNaN(parseFloat(values.price))) {
                toast.error("Цената е невалидна.");
                return;
            }

            const processed = {
                ...values,
                price: values.price === "" ? undefined : parseFloat(values.price),
                discountPrice: values.discountPrice ? parseFloat(values.discountPrice) : undefined,
                quantity: values.quantity ? parseInt(values.quantity) : 0,
                unitCount: values.unitCount ? parseInt(values.unitCount) : undefined,
                isFeatured: Boolean(values.isFeatured),
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
                    discountPrice: "",
                    category: "",
                    subCategory: "",
                    description: "",
                    tags: "",
                    manufacturer: "",
                    quantity: "",
                    unitCount: "",
                    unitType: "",
                    originCountry: "",
                    isFeatured: false,
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
            images: Array.isArray(product.images) ? product.images : [],
            price: product.price?.toString() ?? "",
            discountPrice: product.discountPrice?.toString() ?? "",
            category: product.category || "",
            subCategory: product.subCategory || "",
            description: product.description || "",
            tags: (product.tags || []).join(", "),
            manufacturer: product.manufacturer || "",
            quantity: product.quantity?.toString() ?? "",
            unitCount: product.unitCount?.toString() ?? "",
            unitType: product.unitType || "",
            originCountry: product.originCountry || "",
            isFeatured: !!product.isFeatured,
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
                    appendImage(reader.result)
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
