import { useMemo, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useForm } from "./useForm";
import userApi from "../api/auth";
import { toast } from "react-toastify";

export function useProfile() {
    const { firstName, lastName, phone, email } = useAuthContext();
    const [editMode, setEditMode] = useState(false);

    const initialValues = useMemo(() => ({
        firstName: firstName || "",
        lastName: lastName || "",
        email: email || "",
        phone: phone || "",
    }), [firstName, lastName, email, phone]);

    const {
        values,
        errors,
        pending,
        setValues,
        setPending,
        setError,
        changeHandler,
        submitHandler,
    } = useForm(
        initialValues,
        onSubmit,
        { reinitializeForm: false }
    );

    function isSameData(newData, originalData) {
        return Object.keys(originalData).every(
            key => newData[key] === originalData[key]
        );
    }

    async function onSubmit(formData) {
        if (isSameData(formData, initialValues)) {
            toast.info("Няма направени промени.");
            setEditMode(false);
            return;
        }

        try {
            await userApi.update(formData);
            toast.success("Профилът е обновен успешно.");
            setEditMode(false);
        } catch (err) {
            console.error("Грешка при обновяване:", err);
            toast.error("Неуспешно обновяване на профила.");
        }
    }

    const handleEdit = () => setEditMode(true);

    const handleCancel = () => {
        setValues(initialValues);
        setEditMode(false);
    };

    return {
        editMode,
        pending,
        errors,
        values,
        changeHandler,
        submitHandler,
        handleEdit,
        handleCancel,
    };
}
