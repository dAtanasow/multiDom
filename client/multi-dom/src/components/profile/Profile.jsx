import { useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import { ProfileFields } from "./ProfileFields";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useLogout } from "../../hooks/useAuth";

const sections = [
    { key: "details", label: "Детайли" },
    { key: "shipping", label: "Адреси за доставка" },
    { key: "billing", label: "Адреси за фактура" },
    { key: "orders", label: "Поръчки" },
    { key: "payments", label: "Плащания" },
    { key: "files", label: "Файлове" },
    { key: "favorites", label: "Любими стоки" },
];

export default function Profile() {
    const [activeTab, setActiveTab] = useState("details");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const isMobile = useIsMobile();
    const logout = useLogout();

    const {
        editMode,
        pending,
        errors,
        values,
        changeHandler,
        submitHandler,
        handleEdit,
        handleCancel,
    } = useProfile();

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
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
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
                        <aside className="absolute top-0 left-0 w-64 h-full bg-white shadow-lg p-6 z-20 transition-transform duration-300">
                            <SidebarContent />
                        </aside>
                    </>
                )}

                {!isMobile && (
                    <aside className="w-64 bg-white border-r p-6">
                        <SidebarContent />
                    </aside>
                )}

                <main className="flex-1 p-6 relative z-0">
                    <div className="p-6 relative">
                        {activeTab === "details" ? (
                            <>
                                <h3 className="text-xl font-semibold text-center mb-6">Детайли на профила</h3>
                                <form onSubmit={editMode ? submitHandler : undefined}>
                                    <ProfileFields
                                        values={values}
                                        changeHandler={changeHandler}
                                        editMode={editMode}
                                    />
                                    {editMode ? (
                                        <EditButtons pending={pending} onCancel={handleCancel} />
                                    ) : (
                                        <ViewButton onEdit={handleEdit} />
                                    )}
                                </form>
                            </>
                        ) : (
                            <OtherTabContent sections={sections} activeTab={activeTab} />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
    function SidebarContent() {
        return (
            <>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Категории</h2>
                    {isMobile && (
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="text-gray-500 text-2xl"
                            aria-label="Затвори меню"
                        >
                            ×
                        </button>
                    )}
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
                        onClick={logout}
                        className="text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-100 transition mt-4"
                    >
                        Изход
                    </button>
                </nav>
            </>
        );
    }
}

function EditButtons({ pending, onCancel }) {
    return (
        <div className="flex justify-center gap-4 mt-6">
            <button
                type="submit"
                disabled={pending}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
                {pending ? "Запазване..." : "Запази"}
            </button>
            <button
                type="button"
                onClick={onCancel}
                className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition"
            >
                Отказ
            </button>
        </div>
    );
}

function ViewButton({ onEdit }) {
    return (
        <div className="flex justify-center mt-6">
            <button
                type="button"
                onClick={onEdit}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
                Редактирай
            </button>
        </div>
    );
}

function OtherTabContent({ sections, activeTab }) {
    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">
                {sections.find((s) => s.key === activeTab)?.label}
            </h3>
            <p>Съдържание за {sections.find((s) => s.key === activeTab)?.label}.</p>
        </div>
    );
}