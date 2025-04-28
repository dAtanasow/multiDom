import { useEffect, useState } from "react";

export function useForm(initialValues, submitCallback, options = { reinitializeForm: false }) {
    const [values, setValues] = useState(initialValues);
    const [errors, setError] = useState([]);
    const [pending, setPending] = useState(false);

    useEffect(() => {
        if (options.reinitializeForm) {
            setValues(initialValues);
        }
    }, [initialValues, options.reinitializeForm]);

    const changeHandler = (e) => {
        setValues((state) => ({
            ...state,
            [e.target.name]: e.target.value,
        }));

        if (errors[e.target.name]) {
            setError((state) => ({
                ...state,
                [e.target.name]: undefined,
            }));
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (pending) return;

        setPending(true);

        try {
            await submitCallback(values);
            setError([]);
        } catch (error) {
            setError(error);
        } finally {
            setPending(false);
        }
    };

    return {
        values,
        errors,
        pending,
        setValues,
        setPending,
        setError,
        changeHandler,
        submitHandler,
    };
}