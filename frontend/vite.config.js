import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    css: {
        postcss: './postcss.config.js',
    },
    server: {
        host: true, 
    },
    build: {
        rollupOptions: {
            input: 'index.html', // Set the entry point
        },
    },
});
