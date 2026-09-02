---
paths:
  - "src/contexts/**"
---

# Context Conventions

## When to use context

Use React context when logic or state applies **across the application** — shared by many unrelated components or routes:

- Authentication session and login/logout (`AuthContext`)
- Layout chrome (sidebar, mobile drawer) (`LayoutContext`)
- Future: theme, locale override, global notifications

**Do not use context for:**

- Page-local state (filters, dialog open/close, form state) — keep in page or section hooks
- Feature data that comes from the API — use TanStack Query via `hooks/data/` instead
- Props that only pass one or two levels — use regular props

If only a subtree needs shared state, prefer a section hook or component composition before reaching for context.

## File structure

- One context per file: `contexts/AuthContext.tsx`, `contexts/LayoutContext.tsx`
- Each context file exports exactly two things: the `XProvider` component and a `useX` hook that throws when used outside the provider

```tsx
export const useLayout = () => {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error('useLayout must be used within LayoutProvider')
  }
  return context
}
```

- Never export the raw context object — consumers go through the hook
- Providers are wired up in `src/App.tsx`
- Persist state to localStorage inside the provider when it must survive reloads (see `sidebarExpanded` in LayoutContext)

## Context + API

Contexts may orchestrate TanStack Query primitives (`api/hooks/`) — see `AuthContext`, which wraps `useAuthSession`, `useLogin`, and `useLogout`. Rules:

- Query/mutation hooks stay in `api/hooks/` — context composes them, does not duplicate HTTP
- Context exposes a stable imperative API (`login`, `logout`, `retrySession`) built on `mutateAsync`
- Cache invalidation and session side effects live in the provider, not in consuming components
- `AuthContext` is the only non-`api/` file allowed to import `apiClient` (for `onUnauthorized`)
