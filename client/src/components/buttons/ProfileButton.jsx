import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

export default function ProfileButton() {
    const { accessToken } = useAuthContext();
    const navigate = useNavigate();
    const [_, setSearchParams] = useSearchParams();

    const handleClick = () => {
        if (accessToken) {
            navigate("/profile");
        } else {
            setSearchParams({ panel: "login" });
        }
    };

    return (
        <button
            onClick={handleClick}
            className="cursor-pointer p-2 rounded-xl hover:bg-blue-700 transition"
        >
            <svg
                className="w-7 h-7 text-blue-600 hover:text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3A2.25 2.25 0 008.25 5.25V9m11.25 11.25v-1.5a2.25 2.25 0 00-2.25-2.25h-12a2.25 2.25 0 00-2.25 2.25v1.5M12 12a3 3 0 100-6 3 3 0 000 6z"
                />
            </svg>
        </button>
    );
}
