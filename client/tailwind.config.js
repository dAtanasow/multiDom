import scrollbar from 'tailwind-scrollbar';
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,css}",
    ],
    safelist: [
        'react-tel-input',
        'country-list',
        'search-box',
        'scrollbar-none',
        'hover:scrollbar-thin',
        'hover:scrollbar-thumb-blue-300',
    ],
    theme: {
        extend: {
            backgroundImage: {
                'animated-gradient': 'linear-gradient(-45deg, #4facfe, #00f2fe, #43e97b, #38f9d7)',
            },
            animation: {
                'slide-in-right': 'slide-in-right 0.3s ease-out forwards',
                'gradient-bg': 'gradient 15s ease infinite',
            },
            keyframes: {
                'slide-in-right': {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
            },
            fontFamily: {
                sans: ['"Montserrat"', 'sans-serif'],
            },
        },
    },
    plugins: [scrollbar],

}
