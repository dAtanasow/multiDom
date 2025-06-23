
export default function Sidebar({ sections, activeTab, setActiveTab, logout, isLoggingOut }) {
    return (
        <aside className="hidden md:flex flex-col w-64 bg-white border-r pt-10 lg:mt-15 xl:mt-10 px-4 shadow-sm space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 text-center mt-10 mb-4">
                Профил
            </h2>
            {sections.map((s) => (
                <button
                    key={s.key}
                    onClick={() => setActiveTab(s.key)}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition text-sm font-medium ${
                        activeTab === s.key
                            ? "bg-blue-600 text-white shadow"
                            : "text-gray-700 hover:bg-blue-50"
                    }`}
                >
                    <span className="text-lg">{s.icon}</span>
                    {s.label}
                </button>
            ))}
            <button
                onClick={logout}
                disabled={isLoggingOut}
                className="mt-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 mb-5 rounded-lg transition"
            >
                {isLoggingOut ? "Излизане..." : "Изход"}
            </button>
        </aside>
    );
}