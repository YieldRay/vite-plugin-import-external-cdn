import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import importExternalCDN from "vite-plugin-import-external-cdn";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), viteSingleFile(), importExternalCDN()],
});
