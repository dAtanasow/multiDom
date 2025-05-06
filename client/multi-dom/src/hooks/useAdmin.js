import { useEffect, useState } from "react";
import { useForm } from "./useForm";
import productApi from "../api/catalog";
import adminApi from "../api/admin";
import { toast } from "react-toastify";
import { confirmAlert } from 'react-confirm-alert';
import navLinks from "../utils/navLinks";

export function useCreateProduct(editingProduct, setEditingProduct, setProductView) {
    const {
        values,
        pending,
        changeHandler,
        submitHandler,
        setValues,
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
            const { name, price, category, subCategory, manufacturer } = values;

            if (!name || !price || !category || !subCategory || !manufacturer) {
                toast.error("Моля, попълнете всички задължителни полета.");
                return;
            }

            if (!values.images?.length) {
                toast.error("Моля, добавете поне една снимка.");
                return;
            }

            const processed = {
                ...values,
                price: parseFloat(values.price),
                discountPrice: values.discountPrice === "" ? null : parseFloat(values.discountPrice),
                quantity: values.quantity ? parseInt(values.quantity) : 0,
                unitCount: values.unitCount ? parseInt(values.unitCount) : undefined,
                isFeatured: Boolean(values.isFeatured),
                tags: values.tags.split(",").map(tag => tag.trim()).filter(Boolean),
                images: values.images.filter(img => typeof img === "string" && img.startsWith("data:image")),
            };

            try {
                if (editingProduct) {
                    await adminApi.updateProduct(editingProduct._id, processed);
                    toast.success("Продуктът е обновен успешно.");
                    setEditingProduct(null);
                    setProductView?.("list");
                } else {
                    await adminApi.createProduct(processed);
                    toast.success("Продуктът е създаден успешно.");
                }

                resetForm();
            } catch (err) {
                toast.error("Възникна грешка при запазване.");
            } finally {
                setPending(false);
            }
        },
        { reinitializeForm: false }
    );

    const resetForm = () => {
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
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) appendImage(reader.result);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setValues((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    useEffect(() => {
        if (editingProduct) {
            setValues({
                name: editingProduct.name || "",
                images: Array.isArray(editingProduct.images) ? editingProduct.images : [],
                price: editingProduct.price?.toString() ?? "",
                discountPrice: editingProduct.discountPrice?.toString() ?? "",
                category: editingProduct.category || "",
                subCategory: editingProduct.subCategory || "",
                description: editingProduct.description || "",
                tags: (editingProduct.tags || []).join(", "),
                manufacturer: editingProduct.manufacturer || "",
                quantity: editingProduct.quantity?.toString() ?? "",
                unitCount: editingProduct.unitCount?.toString() ?? "",
                unitType: editingProduct.unitType || "",
                originCountry: editingProduct.originCountry || "",
                isFeatured: !!editingProduct.isFeatured,
            });
        }
    }, [editingProduct]);

    return {
        values,
        pending,
        navLinks,
        editingProduct,
        changeHandler,
        submitHandler,
        handleImageUpload,
        removeImage,
    };
}

export function useProductsTable() {
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

    const handleEdit = (product) => {
        setEditingProduct(product);
    };

    const handleDelete = (id) => {
        confirmAlert({
            message: "Сигурни ли сте, че искате да изтриете този продукт?",
            buttons: [
                {
                    label: "Да",
                    onClick: async () => {
                        try {
                            await adminApi.deleteProduct(id);
                            toast.success("Продуктът беше изтрит успешно.");
                            fetchProducts();
                        } catch (err) {
                            toast.error("Възникна грешка при изтриване.");
                        }
                    },
                },
                {
                    label: "Не",
                    onClick: () => toast.info("Изтриването беше отменено."),
                },
            ],
        });
    };

    return {
        products,
        editingProduct,
        setEditingProduct,
        fetchProducts,
        handleEdit,
        handleDelete,
    };
}
