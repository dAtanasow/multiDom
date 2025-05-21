import { useEffect, useRef, useState } from "react";

export function useForm(initialValues, submitCallback, options = { reinitializeForm: false }) {
    const [errors, setError] = useState([]);
    const [pending, setPending] = useState(false);

    const valuesRef = useRef(initialValues);
    const [valuesState, setValuesState] = useState(initialValues);

    const setValues = (newValues, merge = true) => {
        const updated =
            typeof newValues === "function"
                ? newValues(valuesRef.current)
                : newValues;

        const result = merge
            ? { ...valuesRef.current, ...updated }
            : updated;

        valuesRef.current = result;
        setValuesState(result);
    };

    useEffect(() => {
        if (options.reinitializeForm) {
            setValues(initialValues, false);
        }
    }, [options.reinitializeForm, initialValues]);

    const changeHandler = (e) => {
        const { name, type, value, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;

        const path = name.split(".");
        const newValues = { ...valuesRef.current };
        let current = newValues;

        for (let i = 0; i < path.length - 1; i++) {
            const part = path[i];
            current[part] = current[part] || {};
            current = current[part];
        }

        current[path[path.length - 1]] = newValue;

        valuesRef.current = newValues;
        setValuesState(newValues);

        if (errors[name]) {
            setError((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (pending) return;

        setPending(true);
        try {
            await submitCallback(valuesRef.current);
            setError([]);
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
        appendImage
    };
}
