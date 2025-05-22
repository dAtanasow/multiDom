import { useEffect, useRef } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import { openLoginPanel } from "../../utils/panel";

export default function AdminRoute({ children }) {
    const { isAuthenticate, role, loading } = useAuthContext();
    const hasPromptedRef = useRef(false);

    useEffect(() => {
        if (!isAuthenticate || role !== 'admin') {
            if (!hasPromptedRef.current) {
                openLoginPanel();
                hasPromptedRef.current = true;
            }
        }
    }, [isAuthenticate, role]);

    if (loading) {
        return <div className="text-center p-4">Проверка на достъпа...</div>;
    }

    if (!isAuthenticate || role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
}
