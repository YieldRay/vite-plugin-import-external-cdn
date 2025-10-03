import type { Plugin } from "vite";
import { cwd } from "node:process";
import { URL } from "node:url";
import { resolve } from "node:path";
import { createRequire } from "node:module";
import type { ImportMap } from "./shared/importMap";
import { createPluginName } from "./shared/create";
import type { PackageJSON } from "./shared/pkg";

interface Options {
  path: (name: string, version: string, deps: Record<string, string>) => string | URL;
  importMap?: ImportMap;
}

const usePlugin = ({ path, importMap }: Partial<Options> = {}): Plugin => {
  const useName = createPluginName(false);
  const name = useName("import-external-cdn");

  return {
    name,
    config: ({ root }) => {
      // assume vite.config.ts is in the root of the project
      const __dirname = root || cwd();
      const require = createRequire(__dirname);
      const packageJson: PackageJSON = require(resolve(__dirname, "package.json"));
      // the installed dependencies will be treated as external
      const external = Object.keys(packageJson.dependencies || {});

      const getPackageJSONCache: Record<string, PackageJSON> = {};
      function getPackageJSON(packageName: string): PackageJSON {
        if (getPackageJSONCache[packageName]) {
          return getPackageJSONCache[packageName];
        }
        try {
          // assume vite.config.ts is in the root of the project
          const packageJsonPath = resolve(__dirname, "node_modules", `${packageName}/package.json`);
          const packageJson = require(packageJsonPath);
          getPackageJSONCache[packageName] = packageJson;
          return packageJson;
        } catch {
          throw new Error(`[${name}] cannot find package.json of "${packageName}", is it installed?`);
        }
      }

      /** rollupOptions.output.paths */
      const paths = external.reduce((acc, name) => {
        const pkg = getPackageJSON(name);
        // if this package has peerDependencies and they are also in the dependencies of the project,
        // we ensure deps to be the same version as those installed in the project
        // this is useful for CDN that supports dependency pre-bundling like esm.sh
        const deps: Record<string, string> = {};
        for (const peer of Object.keys(pkg.peerDependencies || {})) {
          if (external.includes(peer)) {
            const { version } = getPackageJSON(peer);
            deps[peer] = version;
          }
        }

        if (path) {
          acc[name] = String(path(name, pkg.version, deps));
          return acc;
        } else {
          // use esm.sh as default CDN
          let url = `https://esm.sh/${name}@${pkg.version}?target=esnext`;
          const depsEntries = Object.entries(deps);
          if (depsEntries.length) {
            // By default, esm.sh rewrites import specifiers based on the package dependencies.
            // To specify the version of these dependencies, you can add ?deps=PACKAGE@VERSION to the import URL.
            // To specify multiple dependencies, separate them with commas, like this: ?deps=react@18.2.0,react-dom@18.2.0.
            url += `&deps=${depsEntries.map(([k, v]) => `${k}@${v}`).join(",")}`;
          }
          acc[name] = url;
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
