import { useEffect, useState } from "react";
import { useForm } from "./useForm";
// import { toast } from "react-toastify";
import { toast } from "sonner";
import { useAuthContext } from "../context/AuthContext";
import profileApi from "../api/profile";

export function useProfile() {
    const { firstName, lastName, phone, email, changeAuthState } = useAuthContext();
    const [editMode, setEditMode] = useState(false);

    const [initialValues, setInitialValues] = useState(() =>
        JSON.parse(JSON.stringify({
            firstName: firstName || "",
            lastName: lastName || "",
            email: email || "",
            phone: phone || "",
        }))
    );

    const {
        values,
        errors,
        pending,
        setValues,
        changeHandler,
        submitHandler,
    } = useForm(initialValues, onSubmit);

    useEffect(() => {
        const newValues = {
            firstName: firstName || "",
            lastName: lastName || "",
            email: email || "",
            phone: phone || "",
        };
        setInitialValues(newValues);
        setValues(newValues);
    }, [firstName, lastName, email, phone, setValues]);

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
            const result = await profileApi.updateUser(formData);
            changeAuthState({ user: result.user });
            const updatedValues = {
                firstName: result.user.firstName,
                lastName: result.user.lastName,
                email: result.user.email,
                phone: result.user.phone,
            };

            setInitialValues(updatedValues);
            setValues(updatedValues);
            toast.success("Профилът е обновен успешно.");
            setEditMode(false);
        } catch (err) {
            console.error("Грешка при обновяване:", err);
            toast.error("Неуспешно обновяване на профила.");
        }
    }

    const handleEdit = () => {
        setEditMode(true);
    }

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
