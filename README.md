# vite-plugin-import-external-cdn

从外部 CDN 导入所有依赖（只支持产物为 ESM）。

> 备注：仅 JS 模块转换为 CDN 导入；对于其它资源，如依赖的样式，vite 仍输出构建产物，目前此插件不会输出额外的 CDN 样式标签。

##### before

```
✓ 2793 modules transformed.
dist/index.html                         0.43 kB │ gzip:   0.28 kB
dist/assets/AboutView-DUF006EN.css      0.12 kB │ gzip:   0.12 kB
dist/assets/index-BdN_gSFT.css          4.21 kB │ gzip:   1.30 kB
dist/assets/AboutView-CbBhw_eO.js       0.28 kB │ gzip:   0.23 kB
dist/assets/index-D1lIPoea.js       1,400.64 kB │ gzip: 388.35 kB
```

##### after

```
✓ 30 modules transformed.
dist/index.html                      0.43 kB │ gzip: 0.28 kB
dist/assets/AboutView-DUF006EN.css   0.12 kB │ gzip: 0.12 kB
dist/assets/index-BdN_gSFT.css       4.21 kB │ gzip: 1.30 kB
dist/assets/AboutView-CJ3UIVgX.js    0.56 kB │ gzip: 0.35 kB
dist/assets/index-pHFOng-m.js       14.06 kB │ gzip: 5.42 kB
```

## Usage

```sh
npm i -D vite-plugin-import-external-cdn
```

使用示例参见 [examples 目录](./examples)

```js
import { defineConfig } from "vite";
import importExternalCDN from "vite-plugin-import-external-cdn";

export default defineConfig({
    plugins: [importExternalCDN()],
});
```

[esm.sh](https://esm.sh) 是默认的 CDN 导入源，path 选项允许使用指定的 http 导入。

例如：

```js
import { defineConfig } from "vite";
import importExternalCDN from "vite-plugin-import-external-cdn";

export default defineConfig({
    plugins: [
        importExternalCDN({
            path: (name, version) => `https://esm.run/${name}@${version}`,
        }),
    ],
});
```

## Development

### install

```shell
# 工作区安装
pnpm i

# 源码依赖安装
pnpm i -w
```

### init:info

```shell
pnpm init:info
```

### test

```shell
pnpm test

# or pnpm test:watch
```

### build

```shell
pnpm build
```

### coverage

```shell
pnpm coverage
```

### dev

```shell
pnpm dev
```

### publish

```shell
npm publish
```

### play

```shell
# 工作区 dev
pnpm play

# or pnpm play:open
# or pnpm play:host
# or pnpm play:build
# or pnpm play:preview
# or pnpm play:preview:open
# or pnpm play:preview:host
```

### release

```shell
pnpm release
```

<br />
<br />

## License

Made with [YieldRay](https://github.com/YieldRay)

Published under [MIT License](./LICENSE).

<br />
