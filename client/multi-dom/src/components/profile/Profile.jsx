import { useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import { ProfileFields } from "./ProfileFields";
import { useIsMobile } from "../../hooks/useResponive";
import { useLogout } from "../../hooks/useAuth";
import {
    FiUser,
    FiPackage,
    FiHeart,
    FiLogOut,
    FiFileText,
} from "react-icons/fi";
import SaveButton from "../buttons/SaveButton";
import EditButton from "../buttons/EditButton";

const sections = [
    { key: "details", label: "Детайли", icon: <FiUser /> },
    { key: "orders", label: "Поръчки", icon: <FiPackage /> },
    { key: "favorites", label: "Любими", icon: <FiHeart /> },
    { key: "addresses", label: "Адреси", icon: <FiFileText /> },
];

export default function Profile() {
    const [activeTab, setActiveTab] = useState("details");
    const isMobile = useIsMobile();
    const logout = useLogout();

    const {
        editMode,
        pending,
        values,
        changeHandler,
        submitHandler,
        handleEdit,
        handleCancel,
    } = useProfile();

    return (
        <div className="flex flex-col min-h-screen pb-20">
            {/* Header за мобилни */}
            {isMobile && (
                <header className="h-16 bg-white flex items-center justify-center px-4 shadow-md relative z-10">
                    <h1 className="text-xl font-bold">Профил</h1>
                </header>
            )}
            <div className="flex flex-1">

                {!isMobile && (
                    <aside className="w-64 bg-white border-r p-6 hidden md:block">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold mb-4">Профил</h2>
                        </div>
                        <nav className="space-y-2">
                            {sections.map((s) => {
                                const isActive = activeTab === s.key;
                                return (
                                    <button
                                        key={s.key}
                                        onClick={() => setActiveTab(s.key)}
                                        className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg text-sm transition ${isActive ? "bg-blue-600 text-white" : "hover:bg-blue-100 text-gray-700"}`}
                                    >
                                        <span className="text-lg">{s.icon}</span>
                                        <span>{s.label}</span>
                                    </button>
                                );
                            })}
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 w-full px-4 py-2 mt-6 rounded-lg text-sm text-red-600 hover:bg-red-100"
                            >
                                <FiLogOut className="text-lg" />
                                <span>Изход</span>
                            </button>
                        </nav>
                    </aside>
                )}

                {/* Основна част */}
                <main className="flex-1 p-6 relative z-0">
                    <div className="p-6 relative">

                        <h3 className="text-xl font-semibold text-center mb-6">
                            Детайли на профила
                        </h3>
                        <form onSubmit={editMode ? submitHandler : undefined}>
                            <ProfileFields
                                values={values}
                                changeHandler={changeHandler}
                                editMode={editMode}
                            />
                            {editMode ? (
                                <SaveButton pending={pending} onCancel={handleCancel} />
                            ) : (
                                <EditButton onEdit={handleEdit} />
                            )}
                        </form>
                    </div>
                </main>
            </div>

            {/* Долна мобилна навигация */}
            {isMobile && (
                <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow z-50 flex justify-around items-center h-16 transition-all duration-300">
                    {sections.map((s) => {
                        const isActive = activeTab === s.key;
                        return (
                            <button
                                key={s.key}
                                onClick={() => setActiveTab(s.key)}
                                className={`flex flex-col items-center text-xs px-2 py-1 rounded-md transition-all duration-200 ${isActive ? "bg-blue-100 text-blue-600" : "text-gray-500"
                                    }`}
                            >
                                <span className="text-lg">{s.icon}</span>
                                <span className="text-[10px]">{s.label}</span>
                            </button>
                        );
                    })}

                    <button
                        onClick={logout}
                        className="flex flex-col items-center text-xs text-red-600"
                    >
                        <FiLogOut className="text-lg" />
                        <span className="text-[10px]">Изход</span>
                    </button>
                </nav>
            )}
        </div>
    );
}