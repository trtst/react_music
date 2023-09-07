import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
    ],
    resolve: {
        // extensions: ['.jsx', 'js', '.scss', 'css'],    TIPS-01:目前会导致引入antd报错 
        alias: {
            '@': resolve(__dirname, './src'),
            '@assets': resolve(__dirname, './src/assets'),
            '@router': resolve(__dirname, 'src/router'),
            '@view': resolve(__dirname, 'src/view'),
            '@apis': resolve(__dirname, 'src/apis'),
            '@utils': resolve(__dirname, 'src/utils'),
            '@store': resolve(__dirname, 'src/store'),
            '@components': resolve(__dirname, 'src/components'),
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                javascriptEnabled: true,
                additionalData: '@import "@assets/sass/global.scss";',
            },
        },
    },
    server: {
        port: 7474,
        host: '0.0.0.0',
        proxy: {}
    }
})
