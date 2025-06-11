import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function CheckEmail() {
    const navigate = useNavigate();

    useEffect(() => {
        const confirmed = sessionStorage.getItem("emailConfirmed");
        if (confirmed === "true") {
            navigate("/profile");
        }
    }, [navigate]);
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-yellow-100 px-4">
            <div className="bg-white shadow-2xl rounded-3xl px-8 py-10 max-w-md w-full text-center border border-yellow-100">
                <div className="flex justify-center mb-4">
                    <div className="bg-yellow-100 text-yellow-600 p-4 rounded-full shadow-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m0 0H6m2 0h8m0 0h2M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-3xl font-extrabold text-yellow-700 tracking-tight">
                    Потвърди имейла си
                </h1>

                <p className="text-gray-600 mt-4 text-base leading-relaxed">
                    Изпратихме ти линк за потвърждение. Провери пощата си и щракни върху линка, за да активираш акаунта си.
                </p>

                <a
                    href="/"
                    className="mt-6 inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all shadow-sm"
                >
                    ⬅ Върни се към началната страница
                </a>
            </div>
        </div>
    );
}
