import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthContext } from "../../context/AuthContext";

export default function Profile() {
    const { firstName, lastName, phone, email, logout } = useAuthContext();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("details");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const sections = [
        { key: "details", label: "Детайли" },
        { key: "shipping", label: "Адреси за доставка" },
        { key: "billing", label: "Адреси за фактура" },
        { key: "orders", label: "Поръчки" },
        { key: "payments", label: "Плащания" },
        { key: "files", label: "Файлове" },
        { key: "favorites", label: "Любими стоки" },
    ];

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleEditProfile = () => {
        navigate("/profile/edit");
    };

    return (
        <div className="flex flex-col min-h-screen">
            {isMobile && (
                <header className="h-16 bg-white flex items-center justify-between px-4 shadow-md relative z-10">
                    <h1 className="text-xl font-bold">Моят профил</h1>
                    {!isSidebarOpen && (
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="text-2xl"
                        >
                            ☰
                        </button>
                    )}
                </header>
            )}

            <div className="flex flex-1 relative">
                {isMobile && isSidebarOpen && (
                    <>
                        <div
                            className="absolute top-0 left-0 right-0 bottom-0 bg-black/30 z-10"
                            onClick={() => setIsSidebarOpen(false)}
                        ></div>

                        <aside
                            className="absolute top-0 left-0 w-70 h-[100%] bg-white shadow-lg p-6 z-20 transition-transform duration-300"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold">Навигация</h2>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="text-gray-500 text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <nav className="flex flex-col space-y-4">
                                {sections.map((section) => (
                                    <button
                                        key={section.key}
                                        onClick={() => {
                                            setActiveTab(section.key);
                                            setIsSidebarOpen(false);
                                        }}
                                        className={`text-left px-4 py-2 rounded-lg transition ${activeTab === section.key
                                            ? "bg-blue-600 text-white"
                                            : "hover:bg-blue-100"
                                            }`}
                                    >
                                        {section.label}
                                    </button>
                                ))}
                                <button
                                    onClick={handleLogout}
                                    className="text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-100 transition mt-4"
                                >
                                    Изход
                                </button>
                            </nav>
                        </aside>
                    </>
                )}

                {/* Десктоп Сайдбар */}
                {!isMobile && (
                    <aside className="w-64 bg-white border-r p-6">
                        <h2 className="text-2xl font-bold mb-8">Навигация</h2>
                        <nav className="flex flex-col space-y-4">
                            {sections.map((section) => (
                                <button
                                    key={section.key}
                                    onClick={() => setActiveTab(section.key)}
                                    className={`text-left px-4 py-2 rounded-lg transition ${activeTab === section.key
                                        ? "bg-blue-600 text-white"
                                        : "hover:bg-blue-100"
                                        }`}
                                >
                                    {section.label}
                                </button>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-100 transition mt-4"
                            >
                                Изход
                            </button>
                        </nav>
                    </aside>
                )}

                <main className="flex-1 p-6 relative z-0">
                    <div className="p-6 relative">
                        {activeTab === "details" && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-semibold text-center w-full">
                                        Детайли на профила
                                    </h3>

                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                    <div className="bg-gray-100 rounded-xl p-4 shadow-sm flex flex-col items-start">
                                        <span className="text-sm text-gray-500">Име</span>
                                        <span className="text-lg font-semibold text-gray-800">
                                            {firstName} {lastName}
                                        </span>
                                    </div>

                                    <div className="bg-gray-100 rounded-xl p-4 shadow-sm flex flex-col items-start">
                                        <span className="text-sm text-gray-500">Имейл</span>
                                        <span className="text-lg font-semibold text-gray-800">
                                            {email}
                                        </span>
                                    </div>

                                    <div className="bg-gray-100 rounded-xl p-4 shadow-sm flex flex-col items-start">
                                        <span className="text-sm text-gray-500">Телефон</span>
                                        <span className="text-lg font-semibold text-gray-800">
                                            +{phone}
                                        </span>
                                    </div>

                                </div>
                                <button
                                    onClick={handleEditProfile}
                                    className="absolute flex top-100 lg:top-70 xl:top-50 left-0 w-[40%] md:w-30
                                    bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 left-3/10 md:left-7 justify-center">
                                    Редактирай
                                </button>
                            </div>
                        )}

                        {/* Другите табове */}
                        {activeTab !== "details" && (
                            <div>
                                <h3 className="text-xl font-semibold mb-4">
                                    {sections.find((s) => s.key === activeTab)?.label}
                                </h3>
                                <p>Съдържание за {sections.find((s) => s.key === activeTab)?.label}.</p>
                            </div>
                        )}
                    </div >
                </main>
            </div >
        </div >
    );
}
