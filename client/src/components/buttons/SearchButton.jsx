export default function SearchButton({ onClick }) {
    return (
        <button onClick={onClick}
            className="cursor-pointer p-2 rounded-xl hover:bg-blue-700 hover:text-white transition"
            aria-label="Tърсене">
            <svg
                className="w-7 h-7 text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
            </svg>
        </button>
    );
}
