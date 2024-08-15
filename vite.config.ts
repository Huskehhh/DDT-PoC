/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react()],
    clearScreen: false,
    server: {
        strictPort: true,
    },
    envPrefix: ["VITE_", "TAURI_"],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/test/setup.ts",
        css: false,
    },
    build: {
        target: ["es2021"],
        minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
        sourcemap: !!process.env.TAURI_DEBUG,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        // Creates a separate chunk for all node_modules
                        return "vendor";
                    }
                },
            },
        },
        chunkSizeWarningLimit: 1000, // Increase the limit to 1000 KiB to suppress the warning
    },
});
