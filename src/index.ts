import type { Plugin } from "vite";
import { createPluginName } from "./shared/create";
import type { ImportMap } from "./shared/importMap";
import { cwd } from "node:process";
import { URL } from "node:url";
import { resolve } from "node:path";
import { createRequire } from "node:module";

const useName = createPluginName(false);

interface Options {
    path: (name: string, version: string) => string | URL;
    importMap?: ImportMap;
}

const usePlugin = ({ path, importMap }: Partial<Options> = {}): Plugin => {
    const name = useName("import-external-cdn");

    return {
        name,
        config: ({ root }) => {
            const __dirname = root || cwd();
            const require = createRequire(__dirname);

            function getInstalledVersion(packageName: string) {
                try {
                    // assume vite.config.ts is in the root of the project
                    const packageJsonPath = resolve(
                        __dirname,
                        "node_modules",
                        `${packageName}/package.json`
                    );
                    const packageJson = require(packageJsonPath);
                    const { version } = packageJson;
                    return version;
                } catch {
                    throw new Error(
                        `[${name}] cannot find installed version of "${packageName}", is it installed?`
                    );
                }
            }

            // assume vite.config.ts is in the root of the project
            const dependencies = require(resolve(__dirname, "package.json")).dependencies;
            const external = Object.keys(dependencies);
            const paths = external.reduce((acc, name) => {
                const version = getInstalledVersion(name);
                if (path) {
                    acc[name] = String(path(name, version));
                    return acc;
                } else {
                    // use esm.sh as default CDN
                    acc[name] = `https://esm.sh/${name}@${version}?target=esnext`;
                    return acc;
                }
            }, {} as Record<string, string>);

            console.debug(`[${name}]`, paths);

            return {
                build: {
                    target: "esnext",
                    sourcemap: false,
                    rollupOptions: { external, output: { paths } },
                },
            };
        },
        transformIndexHtml: importMap
            ? (html) => {
                  const scriptTag = String.raw`<script type="importmap">
    ${JSON.stringify(importMap, null, 4)}
</script>`;
                  const updatedHtml = html.replace("</title>", `</title>\n${scriptTag}`);
                  return updatedHtml;
              }
            : undefined,
    };
};

export default usePlugin;
