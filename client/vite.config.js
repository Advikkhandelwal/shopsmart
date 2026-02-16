import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/api': { target: 'http://127.0.0.1:5001', changeOrigin: true },
            '/auth': { target: 'http://127.0.0.1:5001', changeOrigin: true },
            '/users': { target: 'http://127.0.0.1:5001', changeOrigin: true },
            '/products': { target: 'http://127.0.0.1:5001', changeOrigin: true },
            '/cart': { target: 'http://127.0.0.1:5001', changeOrigin: true },
            '/orders': { target: 'http://127.0.0.1:5001', changeOrigin: true },
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.js',
    },
})
