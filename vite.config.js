// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                account_signin: resolve(__dirname, 'account/sign-in.html'),
                theme_js: resolve(__dirname, 'js/theme.js'),
            },
            preserveEntrySignatures: "allow-extension"
        },
    },
})