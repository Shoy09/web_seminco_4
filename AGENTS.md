# AGENTS.md

## Commands
- Install with `npm ci`; this repo uses `package-lock.json` and no pnpm/yarn lockfile.
- Dev server: `npm start` (`ng serve`, development config, usually `http://localhost:4200/`).
- Production build/typecheck: `npm run build`; Angular outputs to `dist/proyecto` and uses strict TS/template checks.
- Watch build: `npm run watch` (`ng build --watch --configuration development`).
- Unit tests: `npm test`; for non-watch CI-style runs use `npm test -- --watch=false --browsers=ChromeHeadless`.
- Focus one spec with Karma/Angular CLI: `npm test -- --include='src/app/path/to/file.component.spec.ts' --watch=false --browsers=ChromeHeadless`.
- Technical docs: `npm run compodoc` reads `tsconfig.doc.json` and writes the generated `documentation/` tree.
- There is no lint or formatter script/config in this repo; do not assume `ng lint` exists.

## App Wiring
- This is a standalone Angular app, not an NgModule app: `src/main.ts` bootstraps `AppComponent` with providers from `src/app/app.config.ts`.
- Global providers live in `app.config.ts`: router, HTTP interceptors, animations, ngx-toastr, Angular Material date module, PrimeNG Aura theme/translations, `MessageService`, and `ConfirmationService`.
- Routes are centralized in `src/app/app.routes.ts`; the authenticated shell is `LayoutComponent` with `MenuComponent` children.
- Keep `src/app/app.routes.ts` and `src/app/Components/Principales/menu/menu.component.ts` in sync when changing navigation. Some current menu `routerLink`s are not declared routes and will fall through to `/login`, so verify links instead of trusting menu labels.
- Assets are copied from `public/` by `angular.json`; there is no `src/assets` entry.
- Netlify deployment relies on `netlify.toml` SPA fallback from all paths to `/index.html`.

## API And Auth
- All backend calls should go through `src/app/services/api.service.ts`; the base URL is hardcoded there as `https://api-seminco-4.vercel.app/api` and there are no `src/environments` files.
- `AuthInterceptor` adds `Authorization: Bearer <token>` from localStorage key `authToken`.
- Login stores `authToken`, then fetches `usuarios/perfil` and stores `rol` and `nombre_completo`; logout currently clears all localStorage in the menu.
- Prefer existing domain services in `src/app/services/` over constructing URLs in components.

## Structure And Style
- Most components are standalone and declare their own Angular/Common/PrimeNG imports in `@Component.imports`.
- Legacy feature folders under `src/app/Components/` use Spanish names, capitals, and spaces; quote these paths in shell commands.
- Newer feature-style code is under `src/app/features/monitoreo-mina/`.
- Global styles are in `src/styles.css`: Angular Material prebuilt theme, Tailwind v4 `@import "tailwindcss"`, PrimeIcons, and project `@theme` color tokens.
- `angular.json` also loads `node_modules/ngx-toastr/toastr.css` globally and `node_modules/apexcharts/dist/apexcharts.min.js` as a global script.
- Editor defaults are 2-space indentation and single quotes for TypeScript.
