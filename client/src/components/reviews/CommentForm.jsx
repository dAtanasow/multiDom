import { useState } from "react";

export default function CommentForm({ onSubmit }) {
    const [text, setText] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSubmit(text);
        setText("");
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 items-center mt-2">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Напиши коментар..."
                className="flex-1 border px-3 py-2 text-sm rounded"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 text-sm rounded hover:bg-blue-700">
                Изпрати
            </button>
        </form>
    );
}
