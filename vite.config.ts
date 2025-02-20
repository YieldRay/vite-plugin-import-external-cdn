import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { URL, fileURLToPath } from "node:url";

export default defineConfig({
    build: {
        outDir: "dist",
        minify: true,
        sourcemap: false,
        lib: {
            entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
            formats: ["cjs", "es"],
            fileName: (format) => {
                switch (format) {
                    case "es":
                        return "index.mjs";
                    default:
                        return "index.js";
                }
            },
        },
        rollupOptions: {
            external: [/^node:/],
        },
    },
    plugins: [dts({ rollupTypes: true })],
    clearScreen: false,
});
