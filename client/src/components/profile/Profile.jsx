import { useState, useEffect } from "react";
import { useProfile } from "../../hooks/useProfile";
import { useIsMobile } from "../../hooks/useResponsive";
import { useLogout } from "../../hooks/useAuth.jsx";
import { useAuthContext } from "../../context/AuthContext";
import Sidebar from "./navigation/Sidebar";
import MobileNav from "./navigation/MobileNav";
import ProfileDetails from "./profile-details/ProfileDetails.jsx";
import { sections } from "../../constants/profile-sections.jsx";
import { useLocation, useNavigate, useSearchParams } from "react-router";

export default function Profile() {
    const { isAuthenticated } = useAuthContext();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPath = location.pathname;

    // Get initial active tab from current path
    const initialTab = sections.find(s => s.path === currentPath)?.key || "details";
    const [activeTab, setActiveTab] = useState(initialTab);
    
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

    // Handle tab changes
    const handleTabChange = (newTab) => {
        if (!isAuthenticated) {
            return;
        }
        
        const section = sections.find(s => s.key === newTab);
        if (section && section.path !== currentPath) {
            navigate(section.path, { replace: true });
            setActiveTab(newTab);
        }
    };

    // Update active tab when URL changes
    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        const section = sections.find(s => s.path === currentPath);
        if (section && section.key !== activeTab) {
            setActiveTab(section.key);
        }
    }, [currentPath, activeTab, isAuthenticated]);

    // Clear login panel if authenticated
    useEffect(() => {
        if (isAuthenticated && searchParams.has("panel")) {
            setSearchParams({}, { replace: true });
        }
    }, [isAuthenticated, searchParams, setSearchParams]);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {!isMobile && (
                <Sidebar
                    sections={sections}
                    activeTab={activeTab}
                    setActiveTab={handleTabChange}
                    logout={logout}
                    isLoggingOut={isLoggingOut}
                />
            )}

            <ProfileDetails
                activeTab={activeTab}
                editMode={editMode}
                values={values}
                changeHandler={changeHandler}
                submitHandler={submitHandler}
                pending={pending}
                handleCancel={handleCancel}
                handleEdit={handleEdit}
            />

            {isMobile && (
                <MobileNav
                    sections={sections}
                    activeTab={activeTab}
                    setActiveTab={handleTabChange}
                    logout={logout}
                />
            )}
        </div>
    );
}
