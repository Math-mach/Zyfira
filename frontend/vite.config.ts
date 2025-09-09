import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../API/.env") });

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api": {
                target: `http://localhost:${process.env.PORT}/`,
                changeOrigin: true,
            },
        },
    },
});
