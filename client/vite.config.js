import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/api': { target: process.env.VITE_PROXY_TARGET || 'http://127.0.0.1:5001', changeOrigin: true },
            '/auth': { target: process.env.VITE_PROXY_TARGET || 'http://127.0.0.1:5001', changeOrigin: true },
            '/users': { target: process.env.VITE_PROXY_TARGET || 'http://127.0.0.1:5001', changeOrigin: true },
            '/products': { target: process.env.VITE_PROXY_TARGET || 'http://127.0.0.1:5001', changeOrigin: true },
            '/cart': { target: process.env.VITE_PROXY_TARGET || 'http://127.0.0.1:5001', changeOrigin: true },
            '/orders': { target: process.env.VITE_PROXY_TARGET || 'http://127.0.0.1:5001', changeOrigin: true },
            '/addresses': { target: process.env.VITE_PROXY_TARGET || 'http://127.0.0.1:5001', changeOrigin: true },
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom']
                }
            }
        }
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.js',
    },
})
