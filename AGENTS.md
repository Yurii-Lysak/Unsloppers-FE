<!-- bmad:context -->
<!-- Verified 2026-08-21 against a9eee35. Managed by bmad-project-context; edits inside this block are replaced on refresh. Keep anything you want preserved outside the markers. -->

## people management frontend

React 19 SPA for the people management product — Vite 8, TanStack Query, Tailwind v4 + shadcn/ui, Playwright e2e. This repo is the `services/frontend` submodule; product scope lives in the workspace repo at `docs/project-requirements.md`.

## Policy

- Commit application changes here, not the workspace root — the parent repo holds only BMad artifacts and submodule gitlinks.
- Never restructure `src/components/ui/` — add shadcn components via `npx shadcn@latest add [name]` only.

## Where things are

- Stack overview and commands: `CLAUDE.md`
- Per-area conventions (path-triggered): `.claude/rules/` — api, components, pages, hooks, contexts, i18n, styling, e2e
- Normative product requirements: `../../docs/project-requirements.md` (workspace repo)
- Backend API (separate submodule): `../backend/` — default base URL `http://localhost:3001`

## Running and verifying

- Run all npm scripts from this directory — the workspace root has no frontend toolchain.
- `npm run build` typechecks then builds; use `npm run typecheck` alone while iterating.
- Playwright starts Vite via `playwright.config.ts` — no separate dev server needed for `npm run test`.

## Conventions that differ from defaults

- React components are arrow functions only — never `function` declarations.
- Import via `@/` alias — no deep relative paths (`../../../`).
- User-facing text uses i18n — add keys to `src/locales/en/translation.json` first; keys are type-checked via `src/@types/i18next.d.ts`.
- All HTTP goes through TanStack Query: ApiService singletons (`api/services/`) → `api/hooks/` (primitives) → `hooks/data/` (feature data hooks) → page/section hooks → components. Never call `apiClient` or ApiService from components; never import `@/api/hooks/` from page or section components. Mutations must show success/error toasts in `onSuccess`/`onError`.
- Use semantic Tailwind tokens (`bg-background`, `text-foreground`, etc.) — no palette colors, hex, or manual `dark:` variants; see `.claude/rules/react-styling.md`.
- `react-hook-form` and `zod` are not installed — add them when the first form appears.

## Known pitfalls

- Authentication is not implemented — `src/api/client.ts` has a TODO interceptor stub; do not add auth headers until backend auth exists.
- Do not re-add `baseUrl` to tsconfig — `paths` works without it (deprecated in TS 6+).

<!-- /bmad:context -->
