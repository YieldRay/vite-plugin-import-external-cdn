import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { viteSingleFile } from "vite-plugin-singlefile";
import importExternalCDN from "vite-plugin-import-external-cdn";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    viteSingleFile(),
    importExternalCDN({
      path: (name, version, deps) => {
        const standalone = new Set(["naive-ui"]);
        const url = new URL(`https://esm.sh/${name}@${version}`);
        if (standalone.has(name)) url.searchParams.set("standalone", "");
        url.searchParams.set("target", "esnext");
        if (Object.keys(deps).length) {
          url.searchParams.set(
            "deps",
            Object.entries(deps)
              .map(([k, v]) => `${k}@${v}`)
              .join(",")
          );
        }
        return url;
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
