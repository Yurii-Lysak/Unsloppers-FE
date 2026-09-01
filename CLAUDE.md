# React Starter

A clean React starter that will grow into a new product. Detailed per-area conventions live in `.claude/rules/` and load automatically when working with matching files.

## Tech Stack

- **Build**: Vite 8
- **Framework**: React 19 + TypeScript 5.7
- **Styling**: Tailwind CSS v4 + shadcn/ui (Radix UI), Lucide icons
- **Routing**: React Router v7
- **Data Fetching**: TanStack Query + Axios
- **i18n**: i18next / react-i18next (English only)
- **Testing**: Playwright (e2e)
- **Quality**: ESLint + Prettier

## Commands

- `npm run dev` — dev server with HMR (port 4200)
- `npm run build` — typecheck + production build
- `npm run typecheck` — type check without emit
- `npm run lint` / `npm run lint:fix` — ESLint
- `npm run format` / `npm run format:check` — Prettier
- `npm run test` — Playwright e2e (starts Vite itself)

## Project Structure (`src/`)

- `api/` — axios client (`client.ts`), ApiCall functions, and thin query primitives in `api/hooks/`
- `hooks/data/` — feature data hooks (aggregate queries/mutations per domain; consumed by page and section hooks)
- `components/` — shared components, one folder per component (AppLayout, MainLayout, MainHeader, SideMenu); `components/ui/` is shadcn-CLI-managed
- `config/env.ts` — type-safe env access; all env vars must be `VITE_`-prefixed
- `contexts/` — React contexts (LayoutContext)
- `hooks/` — global reusable hooks (not API-related)
- `i18n/` + `locales/` — i18next config and translation files
- `lib/` — shadcn technical utils (`cn()`); no business logic here, use `helpers/`
- `pages/` — one folder per page with its own `hooks/` and `components/`
- `router/` — route configuration (`index.tsx`)

E2E tests live in `e2e/` (flows + shared utilities).

## Code Style (universal)

- No `any` — use `unknown` for truly unknown types; prefer `interface` for object shapes (`strict` is not enabled in tsconfig; ESLint + review enforce this)
- Never run `git add`/`git commit` on your own initiative — leave reviewing and
  staging changes to the developer. Only stage/commit when explicitly asked, or
  when running a skill whose job is specifically to stage, commit, and push
- Never commit or push directly to `main`. Always work on a feature/chore branch
  and push that branch; if currently on `main`, create a branch first before
  making any changes. Opening a PR is always a separate, explicit ask
- TypeScript strict: no `any` — use `unknown` for truly unknown types; prefer `interface` for object shapes
- Arrow functions for all React components, never `function` declarations
- Imports via the `@/` alias, never long relative paths (`../../../`)
- Keep components under 200 lines — split if larger
- Never hardcode user-facing text — always use i18n translation keys
- All code comments in English
- Don't create empty folders
- Forms: `react-hook-form` + `zod` are NOT installed yet — add them (`npm i react-hook-form @hookform/resolvers zod`) when the first form appears

## Environment

- `.env` is gitignored; `.env.example` is the committed template. Defaults in `config/env.ts` work without a `.env` file
- Backend runs at `http://localhost:3001` (`VITE_API_BASE_URL`) — sibling repo, see its own CLAUDE.md

## Gotchas

- tsconfig `paths` works without `baseUrl` (deprecated in TS 6+) — don't re-add `baseUrl`
- There is no authentication in the starter; the API client has a TODO interceptor stub for when auth arrives
