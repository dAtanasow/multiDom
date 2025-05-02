import { useEffect, useRef, useState } from "react";

export function useForm(initialValues, submitCallback, options = { reinitializeForm: false }) {
    const [errors, setError] = useState([]);
    const [pending, setPending] = useState(false);

    const valuesRef = useRef(initialValues);
    const [valuesState, setValuesState] = useState(initialValues);

    const setValues = (newValues) => {
        const cloned = { ...newValues };
        valuesRef.current = cloned;
        setValuesState(cloned);
    };

    useEffect(() => {
        if (options.reinitializeForm) {
            setValues(initialValues);
        }
    }, [options.reinitializeForm, initialValues]);

    const changeHandler = (e) => {
        const { name, value } = e.target;

        valuesRef.current[name] = value;

        setValuesState(prev => ({
            ...prev,
            [name]: value
        }));

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

    return {
        values: valuesState,
        errors,
        pending,
        setValues,
        setPending,
        setError,
        changeHandler,
        submitHandler,
    };
}