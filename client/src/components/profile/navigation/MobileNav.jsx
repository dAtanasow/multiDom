import { FiLogOut } from "react-icons/fi";

export default function MobileNav({ sections, activeTab, setActiveTab, logout }) {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow z-50 flex justify-around items-center h-16">
            {sections.map((s) => {
                const isActive = activeTab === s.key;
                return (
                    <button
                        key={s.key}
                        onClick={() => setActiveTab(s.key)}
                        className={`flex flex-col items-center justify-center px-3 py-1 rounded-md transition-all ${
                            isActive ? "bg-blue-50 text-blue-600 shadow" : "text-gray-500"
                        }`}
                    >
                        <span className="text-lg">{s.icon}</span>
                        <span className="text-[11px] mt-1">{s.label}</span>
                    </button>
                );
            })}
            <button
                onClick={logout}
                className="flex flex-col px-3 py-1 items-center text-xs text-red-600"
            >
                <FiLogOut className="text-lg" />
                <span className="text-[10px]">Изход</span>
            </button>
        </nav>
    );
}