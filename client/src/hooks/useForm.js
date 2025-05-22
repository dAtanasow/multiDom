import { useEffect, useRef, useState } from "react";

export function useForm(initialValues, submitCallback, options = { reinitializeForm: false }) {
    const [errors, setError] = useState({});
    const [pending, setPending] = useState(false);

    const valuesRef = useRef(initialValues);
    const [valuesState, setValuesState] = useState(initialValues);

    const setValues = (newValues, merge = true) => {
        const result = typeof newValues === "function"
            ? newValues(valuesRef.current)
            : newValues;

        const updated = merge
            ? { ...valuesRef.current, ...result }
            : result;

        valuesRef.current = updated;
        setValuesState(updated);
    };

    const changeHandler = (e) => {
        const { name, type, value, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;

        const updated = updateNestedValue(valuesRef.current, name, newValue);
        valuesRef.current = updated;
        setValuesState(updated);

        if (errors[name]) {
            setError((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (pending) return;

        setPending(true);
        try {
            await submitCallback(valuesRef.current);
            setError({});
        } catch (error) {
            setError(error);
        } finally {
            setPending(false);
        }
    };

    const appendImage = (base64) => {
        const updatedImages = Array.isArray(valuesRef.current.images)
            ? [...valuesRef.current.images, base64]
            : [base64];

        valuesRef.current.images = updatedImages;
        setValuesState((prev) => ({
            ...prev,
            images: updatedImages,
        }));
    };

    return {
        values: valuesState,
        errors,
        pending,
        setValues,
        setPending,
        setError,
        changeHandler,
        submitHandler,
        appendImage,
    };
}



function updateNestedValue(obj, path, value) {
    const keys = path.split(".");
    const newObj = { ...obj };
    let current = newObj;

    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        current[key] = current[key] || {};
        current = current[key];
    }

    current[keys[keys.length - 1]] = value;
    return newObj;
}
