import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="h-screen flex flex-col items-center justify-center p-4">
            <div className="text-center p-8 animate-fadeIn">
                <h1 className="text-8xl font-bold text-red-600 mb-4">
                    4
                    <span className="inline-block animate-spin-slow">0</span>
                    4
                </h1>
                <h2 className="text-3xl font-semibold text-gray-700 mb-4 animate-slideIn">
                    Страницата не е намерена
                </h2>
                <p className="text-gray-600 mb-8 max-w-md animate-slideIn">
                    Страницата, която търсите, не съществува или е преместена.
                </p>
                <Link
                    to="/"
                    className="group relative inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-200 bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                >
                    <span className="mr-2">Към началната страница</span>
                    <svg 
                        className="w-5 h-5 transition-transform group-hover:translate-x-1"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                    </svg>
                </Link>
            </div>
        </div>
    );
}