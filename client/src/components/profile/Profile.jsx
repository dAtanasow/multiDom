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
        <div className="flex flex-col min-h-screen pb-20 bg-gray-50">
            <div className="flex flex-1">
                {!isMobile && (
                    <aside className="w-64 min-h-screen bg-white border-r pt-20 px-6 shadow-sm">
                        <h2 className="text-2xl font-bold mb-6 text-center">Профил</h2>
                        <nav className="space-y-2">
                            {sections.map((s) => {
                                const isActive = activeTab === s.key;
                                return (
                                    <button
                                        key={s.key}
                                        onClick={() => setActiveTab(s.key)}
                                        className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg text-sm transition-all duration-200 ${isActive ? "bg-blue-600 text-white" : "hover:bg-blue-100 text-gray-700"}`}
                                    >
                                        <span className="text-lg">{s.icon}</span>
                                        <span>{s.label}</span>
                                    </button>
                                );
                            })}
                            <button
                                onClick={logout}
                                disabled={isLoggingOut}
                                className={`bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded-lg mt-4 transition-all ${isLoggingOut ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {isLoggingOut ? "Излизане..." : "Изход"}
                            </button>
                        </nav>
                    </aside>
                )}

                <main className="flex-1 bg-gray-50 sm:pt-15 px-4 md:px-10 relative">
                    <div className="max-w-5xl flex flex-col gap-5 p-5 mx-auto bg-gray-50">
                        {activeTab === "details" && (
                            <>
                                <h3 className="text-2xl font-bold text-center mb-6">Детайли на профила</h3>
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
                            </>
                        )}

                        {activeTab === "addresses" && (
                            <SavedAddresses />
                        )}
                        {activeTab === "favorites" && (
                            <FavoritesList />
                        )}
                    </div>
                </main>
            </div>

            {isMobile && (
                <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow z-50 flex justify-around items-center h-16">
                    {sections.map((s) => {
                        const isActive = activeTab === s.key;
                        return (
                            <button
                                key={s.key}
                                onClick={() => setActiveTab(s.key)}
                                className={`flex flex-col items-center text-xs px-2 py-1 transition-all ${isActive ? "text-blue-600" : "text-gray-500"}`}
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
