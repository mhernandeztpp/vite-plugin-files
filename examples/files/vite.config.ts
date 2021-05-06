import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import Files from "vite-plugin-files";
import Restart from "vite-plugin-restart";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        reactRefresh(),
        Files({
            name: "vite-plugin-files",
            virtualId: "generate-files",
            filesDir: ["./src/utils", "./src/lib"],
            extensions: ["ts"]
        }),
        Restart({
            restart: ["../../dist/*.js"]
        })
    ]
});
