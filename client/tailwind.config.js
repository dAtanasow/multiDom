import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
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
        },
    },
});
