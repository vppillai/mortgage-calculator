import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { execSync } from 'child_process';

// Get version info at build time
function getVersionInfo() {
    try {
        const version = execSync('git describe --always --tags --dirty', { 
            encoding: 'utf-8',
            stdio: 'pipe'
        }).trim();
        return { GIT_VERSION: JSON.stringify(version) };
    } catch (e) {
        try {
            const commit = execSync('git rev-parse --short HEAD', { 
                encoding: 'utf-8',
                stdio: 'pipe'
            }).trim();
            return { GIT_VERSION: JSON.stringify(commit) };
        } catch (e2) {
            return { GIT_VERSION: JSON.stringify('dev') };
        }
    }
}

export default defineConfig({
    base: '/mortgage-calculator/',
    define: {
        ...getVersionInfo(),
        BUILD_TIME: JSON.stringify(new Date().toISOString()),
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    decimal: ['decimal.js'],
                },
            },
        },
        // Copy version.json to dist
        copyPublicDir: true,
    },
    publicDir: 'public',
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
            manifest: {
                name: 'Mortgage Prepayment Calculator',
                short_name: 'Prepayment Calc',
                description: 'Analyze mortgage prepayment strategies and compare payment options',
                theme_color: '#1e40af',
                background_color: '#ffffff',
                display: 'standalone',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                            },
                        },
                    },
                ],
            },
        }),
    ],
    server: {
        port: 3000,
        open: true,
    },
    preview: {
        port: 4173,
    },
});

