import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        visualizer({ open: true, filename: 'dist/stats.html' }),
    ],
    base: "/brick-stat/",
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        // React core
                        if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                            return 'react-vendor';
                        }
                        // Common utils
                        if (id.includes('lodash') || id.includes('date-fns') || id.includes('axios')) {
                            return 'utils-vendor';
                        }
                        // Heavy charting
                        if (id.includes('chart.js') || id.includes('recharts') || id.includes('d3')) {
                            return 'chart-vendor';
                        }
                        // Icons
                        if (id.includes('lucide') || id.includes('react-icons') || id.includes('@iconify')) {
                            return 'icons-vendor';
                        }
                        // Everything else in node_modules
                        return 'vendor';
                    }
                },
            },
        },
    },
});
