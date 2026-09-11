# Repository Guidelines

## Project Structure & Module Organization

This is a VitePress site and theme:

- `.vitepress/config.mjs` configures the site; `.vitepress/theme/` contains Vue components, views, utilities, stores, and SCSS styles.
- `posts/` contains article Markdown files. `pages/` contains site pages and dynamic route files such as `pages/tags/[name].md`.
- `public/` contains static images, fonts, icons, and other files copied to the built site.
- `api/status.ts` is the Vercel serverless status endpoint. Root Markdown files and `page/` contain home and paginated routes.

Use lowercase, descriptive names for new content routes and follow existing component and utility locations before creating new directories.

## Build, Test, and Development Commands

The project requires Node.js 20 or newer and recommends pnpm.

- `pnpm install` installs dependencies from the lockfile.
- `pnpm dev` starts the VitePress development server.
- `pnpm build` generates the production site in `.vitepress/dist`.
- `pnpm preview` serves the production build locally.
- `pnpm lint` runs ESLint and applies available fixes to JavaScript, TypeScript, and Vue files.
- `pnpm format` formats the repository with Prettier.
- `pnpm deploy:vercel` deploys through Vercel.

## Coding Style & Naming Conventions

Use two spaces, semicolons, double quotes, trailing commas, and a 100-column print width. Prettier and ESLint (`airbnb-base` plus Vue 3 rules) define the baseline. Name Vue components in PascalCase and JavaScript/MJS utilities in camelCase. Reuse existing helpers before adding abstractions or packages.

## Testing Guidelines

No automated test framework or coverage threshold is configured. Run `pnpm build` and `pnpm lint` for every change. For content or UI changes, inspect affected routes with `pnpm dev` or `pnpm preview`; include a screenshot when the visual result changes. Test status endpoint changes with the environment variables in a local or preview deployment.

## Commit & Pull Request Guidelines

Recent commits use short subjects such as `Update status.ts`, `add nssi`, and `delete words and papers`. Keep each commit focused and describe the user-visible change. Pull requests should explain the purpose, list affected routes or components, record validation commands, link a related issue when one exists, and include screenshots for visual changes. Do not commit generated `.vitepress/dist` output or real credentials.

## Key Architecture Details

- `@` alias resolves to `.vitepress/theme/` (configured in `config.mjs` via Vite `resolve.alias`).
- Vue and VitePress APIs are auto-imported (`unplugin-auto-import`); no need to import `ref`, `computed`, `defineComponent`, etc.
- Components and views under `.vitepress/theme/components/` and `.vitepress/theme/views/` are auto-registered (`unplugin-vue-components`).
- Dev server runs on port **9877**.
- PWA is enabled via `@vite-pwa/vitepress` with service-worker caching.
- `cleanUrls: true` — markdown routes produce clean paths without `.html` extensions.
- `buildEnd` generates `sitemap.xml` and `feed.xml` (RSS) into the dist folder.

## Configuration & Secrets

To override theme defaults, copy `.vitepress/theme/assets/themeConfig.mjs` to the repository root as `themeConfig.mjs`; keep the default file in place. Configure `BETTER_STACK_API_TOKEN` and, when needed, the `BETTER_STACK_STATUS_MONITOR_IDS`, `BETTER_STACK_STATUS_MONITOR_URLS`, or `BETTER_STACK_STATUS_MONITOR_NAMES` variables through local or deployment environment settings. Never publish real tokens in source or pull requests.
