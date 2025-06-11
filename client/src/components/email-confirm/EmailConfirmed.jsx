import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import userApi from "../../api/auth";
import { setAccessToken } from "../../utils/authUtil";
import { useAuthContext } from "../../context/AuthContext";

export default function EmailConfirmed() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [confirmedEmail, setConfirmedEmail] = useState("");
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const { changeAuthState } = useAuthContext();

    useEffect(() => {
        const verifyAndLogin = async () => {
            if (!token || sessionStorage.getItem("emailConfirmed")) {
                setLoading(false);
                return;
            }

            try {
                const result = await userApi.confirmEmail(token);
                const { accessToken, email: confirmedEmail } = result;
                setConfirmedEmail(confirmedEmail);
                setAccessToken(accessToken);
                const user = await userApi.getCurrentUser();
                changeAuthState({ user, accessToken });

                if (window.opener) {
                    window.opener.postMessage({ type: "EMAIL_CONFIRMED", accessToken }, "*");
                }

                if (!sessionStorage.getItem("emailConfirmedToastShown")) {
                    toast.success("Имейлът е потвърден успешно!");
                    sessionStorage.setItem("emailConfirmedToastShown", "true");
                }

                sessionStorage.setItem("emailConfirmed", "true");
                setLoading(false);
                window.history.replaceState(null, "", "/email-confirmed");
            } catch (err) {
                console.log(err.message);
                const encodedEmail = encodeURIComponent(email || "");
                navigate(`/email-error?email=${encodedEmail}`);
            }
        };

        verifyAndLogin();
    }, [token, email, changeAuthState, navigate]);

    useEffect(() => {
        const handleUnload = () => {
            sessionStorage.removeItem("emailConfirmedToastShown");
        };

        window.addEventListener("beforeunload", handleUnload);
        return () => {
            window.removeEventListener("beforeunload", handleUnload);
        };
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-white shadow-2xl rounded-3xl px-8 py-10 max-w-md w-full text-center border border-green-100"
            >
                {loading ? (
                    <p className="text-gray-600 text-lg animate-pulse">Зареждане...</p>
                ) : (
                    <>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 160 }}
                            className="flex justify-center mb-4"
                        >
                            <div className="bg-green-100 text-green-600 p-4 rounded-full shadow-inner">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </motion.div>

                        <h2 className="text-3xl font-extrabold text-green-700 tracking-tight">
                            Имейлът е потвърден
                        </h2>

                        <p className="text-gray-700 mt-3 text-base">
                            Имейл <strong>{confirmedEmail}</strong> е потвърден успешно.
                            Можете да затворите този прозорец или да продължите към профила си.
                        </p>
                    </>
                )}
            </motion.div>
        </div>
    );
}
