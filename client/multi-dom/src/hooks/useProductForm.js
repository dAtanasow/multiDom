import { useEffect, useState } from "react";
import productApi from "../api/catalog";
import { useForm } from "./useForm";

const initialValues = {
    name: "",
    brand: "",
    price: "",
    discountPrice: "",
    categoryId: "",
    subCategory: "",
    description: "",
    quantity: "",
    unitCount: "",
    unitType: "",
    image: "",
    isFeatured: false,
};

export function useProductForm() {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

    const submitCallback = async (formValues) => {
        const payload = {
            ...formValues,
            price: parseFloat(formValues.price),
            discountPrice: formValues.discountPrice
                ? parseFloat(formValues.discountPrice)
                : undefined,
        };

        await productApi.create(payload);
        alert("✅ Продуктът е създаден успешно!");
    };

    const {
        values,
        errors,
        pending,
        setValues,
        setError,
        changeHandler,
        submitHandler,
    } = useForm(initialValues, submitCallback);

    useEffect(() => {
        categoryApi.getAll().then(setCategories).catch(console.error);
    }, []);

    useEffect(() => {
        const selected = categories.find((c) => c._id === values.categoryId);
        setSubCategories(selected?.subLinks || []);
        setValues((prev) => ({ ...prev, subCategory: "" }));
    }, [values.categoryId, categories]);

    return {
        values,
        errors,
        pending,
        categories,
        subCategories,
        changeHandler,
        submitHandler,
    };
}
