import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

export default function GuestRoute({ children }) {
    const { isAuthenticate } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticate) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticate, navigate]);

    if (isAuthenticate) {
        return null;
    }

    return children;
}