import { useMemo } from "react";

export default function GenericSearch({ data = [], keys = [], term = "", className = "", children }) {
    const normalize = (value) =>
        String(value ?? "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

    const filtered = useMemo(() => {
        const normalizedTerm = normalize(term.trim());

        return data.filter((item) =>
            keys.some((key) => {
                const fieldValue = item[key];
                return normalize(fieldValue).includes(normalizedTerm);
            })
        );
    }, [term, data, keys]);

    return <div className={className}>{children(filtered)}</div>;
}
