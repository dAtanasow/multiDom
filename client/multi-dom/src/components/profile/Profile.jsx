import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthContext } from "../../context/AuthContext";

export default function Profile() {
    const { username, email, logout } = useAuthContext();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("details");

    const sections = [
        { key: "details", label: "Детайли" },
        { key: "shipping", label: "Адреси за доставка" },
        { key: "billing", label: "Адреси за фактура" },
        { key: "orders", label: "Поръчки" },
        { key: "payments", label: "Плащания" },
        { key: "files", label: "Файлове" },
        { key: "favorites", label: "Любими стоки" },
    ];

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r p-6 hidden md:block">
                <h2 className="text-2xl font-bold mb-8">Моят профил</h2>
                <nav className="flex flex-col space-y-4">
                    {sections.map((section) => (
                        <button
                            key={section.key}
                            onClick={() => setActiveTab(section.key)}
                            className={`text-left px-4 py-2 rounded-lg transition ${activeTab === section.key ? "bg-blue-600 text-white" : "hover:bg-blue-100"
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

            {/* Content */}
            <main className="flex-1 p-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    {activeTab === "details" && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Детайли</h3>
                            <p><strong>Име:</strong> {username}</p>
                            <p><strong>Имейл:</strong> {email}</p>
                        </div>
                    )}

                    {activeTab === "shipping" && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Адреси за доставка</h3>
                            <p>Тук ще се покажат адресите за доставка.</p>
                        </div>
                    )}

                    {activeTab === "billing" && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Адреси за фактура</h3>
                            <p>Тук ще се покажат адресите за фактуриране.</p>
                        </div>
                    )}

                    {activeTab === "orders" && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Поръчки</h3>
                            <p>Тук ще се покажат вашите поръчки.</p>
                        </div>
                    )}

                    {activeTab === "payments" && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Плащания</h3>
                            <p>Тук ще се покажат вашите плащания.</p>
                        </div>
                    )}

                    {activeTab === "files" && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Файлове</h3>
                            <p>Тук ще можете да управлявате файлове.</p>
                        </div>
                    )}

                    {activeTab === "favorites" && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Любими стоки</h3>
                            <p>Тук ще се покажат вашите любими продукти.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
