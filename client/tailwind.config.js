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
    ],
    theme: {
        extend: {
            animation: {
                'slide-in-right': 'slide-in-right 0.3s ease-out forwards',
            },
            keyframes: {
                'slide-in-right': {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
            },
            fontFamily: {
                sans: ['"Montserrat"', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
