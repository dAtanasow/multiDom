import { useCallback } from "react";
import { useRef, useState } from "react";
import { isSame } from "../utils/compare";

export function useForm(initialValues, submitCallback, validators = {}) {
    const [errors, setError] = useState({});
    const [pending, setPending] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [valuesState, setValuesState] = useState(initialValues);

    const valuesRef = useRef(initialValues);

    const setValues = useCallback((newValues, merge = true) => {
        const result = typeof newValues === "function"
            ? newValues(valuesRef.current)
            : newValues;

        const updated = merge
            ? { ...valuesRef.current, ...result }
            : result;

        if (!isSame(valuesRef.current, updated)) {
            valuesRef.current = updated;
            setValuesState(updated);
        }
    }, []);

    const changeHandler = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;

        const updatedValues = {
            ...valuesRef.current,
            [name]: newValue,
        };

        setValues(() => updatedValues);

        if (validators[name]) {
            const error = validators[name](newValue, updatedValues);

            setError((prev) => {
                const { [name]: _, ...rest } = prev;
                return error ? { ...rest, [name]: error } : rest;
            });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (pending) return;

        setSubmitted(true);

        if (validators && typeof validators === "object") {
            const allErrors = {};

            for (const key of Object.keys(validators)) {
                const validator = validators[key];
                if (typeof validator === "function") {
                    const error = validator(valuesRef.current[key], valuesRef.current);
                    if (error) {
                        allErrors[key] = error;
                    }
                }
            }

            if (Object.keys(allErrors).length > 0) {
                setError(allErrors);
                setPending(false);
                return;
            }
        }

        setPending(true);
        try {
            await submitCallback(valuesRef.current);
            setError({});
        } catch (error) {
            if (error.validationErrors) {
                setError(error.validationErrors);
            } else {
                setError({});
            }
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
        submitted,
        validators,
        setValues,
        setPending,
        setError,
        changeHandler,
        submitHandler,
        appendImage,
    };
}