# Valaxy Theme Arknights

[Live preview](https://arknights.valaxy.site/) · [npm](https://www.npmjs.com/package/valaxy-theme-arknights) · [Publishing and deployments](https://github.com/valaxyjs/valaxy-theme-arknights/blob/main/docs/releasing.md)

An original, unofficial AK UI 1.1 inspired blog theme for Valaxy 1.0.0-rc.11 and Vue 3. Includes a featured post, title/tag-filtered archive, article outline, light/dark modes and responsive reading layouts.

[使用文档](https://valaxy.site/zh/themes/arknights) · [User guide](https://valaxy.site/themes/arknights) · [AI theme brief](https://valaxy.site/themes/write#generate-a-theme-with-ai)

See the [repository README](https://github.com/valaxyjs/valaxy-theme-arknights) for the live source example, full options and validation workflow. The source-distributed package includes all required theme files and `@yunyoujun/ak-ui` CSS Core as a dependency.

Install a packed release in your Valaxy blog, then set `theme: 'arknights'` in `valaxy.config.ts`. Types are exported from `valaxy-theme-arknights`, and browser-safe composables from `valaxy-theme-arknights/client`.

This is an independent, unofficial theme. It includes no game artwork and is not affiliated with Arknights or its rights holders. MIT; see LICENSE.

## Install

```bash
pnpm add valaxy-theme-arknights
```

Select `theme: 'arknights'` in your blog’s `valaxy.config.ts`. Requires Valaxy 1.x (1.0.0-rc.11 or later) and Vue 3. See the [configuration and writing guide](https://valaxy.site/themes/arknights).
