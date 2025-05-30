import { useState, useEffect, useMemo } from "react";

export default function GenericSearch({ data = [], keys = [], children, delay = 300 }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedTerm, setDebouncedTerm] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, delay);

        return () => clearTimeout(handler);
    }, [searchTerm, delay]);

    const filtered = useMemo(() => {
        const term = debouncedTerm.toLowerCase();
        return data.filter(item =>
            keys.some(key =>
                (item[key] || "").toString().toLowerCase().includes(term)
            )
        );
    }, [debouncedTerm, data, keys]);

    return (
        <div className="mb-4">
            <input
                type="text"
                placeholder="Търси по име или номер..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-md px-4 py-2 border rounded-xl border-gray-300 focus:outline-none mx-auto"
            />
            {children(filtered)}
        </div>
    );
}
