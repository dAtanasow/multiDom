import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useAuthContext } from "../../context/AuthContext";

export default function AdminButton() {
    const { isAuthenticate, role } = useAuthContext();

    if (!isAuthenticate || role !== "admin") return null;

    return (
        <Link
            to="/admin"
            className="flex items-center gap-2 px-2 py-2 text-sm md:text-base hover:bg-blue-700 rounded-lg transition"
        >
            <ShieldCheck className="text-blue-600 hover:text-white w-7 h-7" />
        </Link>
    );
}
