import { useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import { ProfileFields } from "./ProfileFields";
import { useIsMobile } from "../../hooks/useResponsive";
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
import SavedAddresses from "./saved-address/SaveAddresses";
import FavoritesList from "./favorites/FavoritesList";

const sections = [
    { key: "details", label: "Детайли", icon: <FiUser /> },
    { key: "orders", label: "Поръчки", icon: <FiPackage /> },
    { key: "favorites", label: "Любими", icon: <FiHeart /> },
    { key: "addresses", label: "Адреси", icon: <FiFileText /> },
];

export default function Profile() {
    const [activeTab, setActiveTab] = useState("details");
    const isMobile = useIsMobile();
    const { logout, isLoggingOut } = useLogout();

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
        <div className="flex min-h-screen bg-gray-100">
            {!isMobile && (
                <aside className="hidden lg:flex flex-col w-64 bg-white border-r pt-10 px-4 shadow-sm space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800 text-center mt-10 mb-4">Профил</h2>
                    {sections.map((s) => (
                        <button
                            key={s.key}
                            onClick={() => setActiveTab(s.key)}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition text-sm font-medium ${activeTab === s.key
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
                        className="mt-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                    >
                        {isLoggingOut ? "Излизане..." : "Изход"}
                    </button>
                </aside>
            )}

            <main className="flex-1 pt-12 px-4 md:px-12">
                {activeTab === "details" && (
                    <div className="bg-white rounded-2xl shadow-md p-8 max-w-xl xl:mt-2 md:mt-10 mx-auto">
                        <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">Детайли на профила</h3>
                        <form onSubmit={editMode ? submitHandler : undefined}>
                            <ProfileFields
                                values={values}
                                changeHandler={changeHandler}
                                editMode={editMode}
                            />
                            <div className="mt-6">
                                {editMode ? (
                                    <SaveButton pending={pending} onCancel={handleCancel} />
                                ) : (
                                    <EditButton onEdit={handleEdit} />
                                )}
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === "addresses" && <SavedAddresses />}
                {activeTab === "favorites" && <FavoritesList />}
            </main>

            {isMobile && (
                <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow z-50 flex justify-around items-center h-16">
                    {sections.map((s) => {
                        const isActive = activeTab === s.key;
                        return (
                            <button
                                key={s.key}
                                onClick={() => setActiveTab(s.key)}
                                className={`flex flex-col items-center justify-center px-3 py-1 rounded-md transition-all ${isActive ? "bg-blue-50 text-blue-600 shadow" : "text-gray-500"
                                    }`}
                            >
                                <span className="text-lg">{s.icon}</span>
                                <span className="text-[11px] mt-1">{s.label}</span>
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
