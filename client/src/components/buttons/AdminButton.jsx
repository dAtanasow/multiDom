import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useAuthContext } from "../../context/AuthContext";

export default function AdminButton() {
    const { isAuthenticate, role } = useAuthContext();

    if (!isAuthenticate || role !== "admin") return null;

    return (
        <Link
            to="/admin"
            className="flex items-center gap-2 px-3 py-2 text-sm md:text-base text-white hover:bg-blue-600 hover:bg-blue-700 rounded-lg transition"
        >
            <ShieldCheck className="text-blue-600" />
        </Link>
    );
}
