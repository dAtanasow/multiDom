import { useAuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, requireAdmin = false }) {
    const { isAuthenticate, role } = useAuthContext();

    const shouldRender = requireAdmin 
        ? (isAuthenticate && role === 'admin')
        : isAuthenticate;

    if (!shouldRender) {
        return <Navigate to="/" replace />;
    }

    return children;
}