import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import path from "path";
import tailwindcss from "@tailwindcss/vite"


dotenv.config({ path: path.resolve(__dirname, "../API/.env") });

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            "/api": {
                target: `http://localhost:${process.env.PORT}/`,
                changeOrigin: true,
            },
        },
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
