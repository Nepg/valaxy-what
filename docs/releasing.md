# Publishing and preview deployments

## Cloudflare Pages

The example is deployed at **<https://arknights.valaxy.site/>**. The Pages project is `valaxy-theme-arknights`, connected to `valaxyjs/valaxy-theme-arknights` through Cloudflare's Git integration.

- Production branch: `main`; other branches receive isolated preview deployments.
- Build command: `pnpm install --frozen-lockfile && pnpm build`.
- Output directory: `demo/dist`.
- Build environment: `NODE_VERSION=22.16.0`, `PNPM_VERSION=10.34.4`, `SKIP_DEPENDENCY_INSTALL=true`, `VITE_BASE=/`.
- `wrangler.jsonc` records the project name and output directory. Build settings and Git integration are configured in Pages.
- The custom domain is associated with the Pages project and has a proxied CNAME to `valaxy-theme-arknights.pages.dev`.

Push a commit to `main` to update the public preview. No Cloudflare API token is needed in GitHub Actions. The manual GitHub Pages workflow remains available as an alternative; it sets its own base path and `SITE_URL`.

## npm Trusted Publishing

`.github/workflows/release.yml` publishes tags matching `v<theme/package.json version>`. The tagged commit must be reachable from `main`.

The workflow checks the theme, builds the example and packs it with **pnpm**, which resolves the workspace catalog in the archive. A separate job downloads that verified `.tgz` and publishes it with npm's OIDC support. Only the publishing job has `id-token: write`. There is no `NPM_TOKEN` secret or registry credential committed in this repository.

Configure the npm Trusted Publisher with:

| Setting           | Value                    |
| ----------------- | ------------------------ |
| Package           | `valaxy-theme-arknights` |
| Provider          | GitHub Actions           |
| Organization      | `valaxyjs`               |
| Repository        | `valaxy-theme-arknights` |
| Workflow filename | `release.yml`            |
| Environment       | Leave empty              |
| Allowed action    | `npm publish`            |

An authenticated maintainer with account 2FA can configure this using npm 11.15+:

```bash
npm trust github valaxy-theme-arknights --file release.yml --repo valaxyjs/valaxy-theme-arknights --allow-publish --yes
npm trust list valaxy-theme-arknights
```

For a fork with an unpublished package name, first publish a verified archive interactively to register the package, then configure its Trusted Publisher. Follow any interactive npm account verification. OIDC authentication happens during publication; `npm whoami` in CI does not test it. See [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers/).

For subsequent releases:

1. Update `theme/package.json` to the intended version. Commit and push that change to `main` using a Conventional Commit.
2. Wait for CI, then create and push the matching tag, for example `git tag v0.1.1` and `git push origin v0.1.1`.
3. Check the **Release to npm** workflow and the version on npm. Stable versions use `latest`; prereleases use `next`. npm generates provenance during the OIDC publish.

An npm version cannot be overwritten. Retry a failed workflow only if that version was not published; use a new version for package changes. The tag workflow does not deploy Pages, and pushing `main` does not publish npm.
