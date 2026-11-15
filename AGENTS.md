# Theme development

This repository is a runnable Valaxy theme example. `theme/` is the source-distributed npm package and `demo/` is its independent consumer. Use pnpm and Node 22.12+.

- Read the Valaxy `valaxy-theme` Skill and AK UI `ak-ui` Skill when available.
- Preserve original industrial geometry, real article metadata and comfortable prose. Do not add game assets or invented telemetry.
- Use Vue 3 script setup with TypeScript. Keep home, navigation, archive and article components focused.
- Verify exported Valaxy APIs in the installed version. Keep `ValaxyMain` / `ValaxyMd` and layout contracts intact.
- Run `pnpm check` and `pnpm pack:theme`. Test the packed archive in a fresh consumer after changing dependencies or exports.
- Inspect desktop/mobile, filters, appearance, keyboard focus and article anchors. Also build with a non-root `VITE_BASE`.
- Use Conventional Commits. Publishing to npm and deploying are separate author actions.
