export default function MenuButton({ onClick }) {
    return (
        <button onClick={onClick}
            className="cursor-pointer p-2 rounded-xl hover:bg-blue-700 hover:text-white transition"
            aria-label="Меню">
            <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                />
            </svg>
        </button>
    );
}
