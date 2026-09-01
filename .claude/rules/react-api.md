---
paths:
  - "src/api/**"
---

# API Layer Conventions

Three layers — keep each in its place:

```
api/*.ts              → ApiCall functions (axios via apiClient)
api/hooks/*.ts        → thin TanStack Query primitives (useQuery / useMutation)
hooks/data/*.ts       → feature data hooks (see react-hooks.md)
```

## ApiCall functions (`api/*.ts`)

- Single configured axios instance: the `apiClient` singleton in `api/client.ts` (baseURL/timeout from `config/env.ts`). Don't create additional axios instances
- Auth headers are not implemented yet — there is a TODO stub in the request interceptor for when auth arrives
- Functions that make API requests are named with the `ApiCall` suffix: `listEmployeesApiCall`, `createFunctionalRoleApiCall`
- Shared API response types live in `src/types/`
- Never import `apiClient` outside `src/api/` (except `AuthContext` for the unauthorized interceptor)

## Query primitives (`api/hooks/*.ts`)

- One hook per operation — these are **low-level** wrappers, not consumed directly by page or section components
- `useQuery` for GET requests; `useMutation` for create / edit / delete
- Export stable query keys alongside hooks (e.g. `employeeListQueryKey`) — used for cache invalidation
- Use stable, descriptive query keys (`['employees', 'list', query]`, `['employees', employeeId, 'profile']`)

```tsx
// api/hooks/useEmployeeList.ts
export const employeeListQueryKey = (query: EmployeeListQuery) =>
  ['employees', 'list', query] as const

export const useEmployeeList = (query: EmployeeListQuery) =>
  useQuery({
    queryKey: employeeListQueryKey(query),
    queryFn: () => listEmployeesApiCall(query),
  })
```

```tsx
// api/hooks/useFunctionalRoles.ts
export const useCreateFunctionalRole = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateFunctionalRoleInput) => createFunctionalRoleApiCall(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: functionalRolesQueryKey })
    },
  })
}
```

- The `QueryClient` is configured in `src/main.tsx` (retry: 1, staleTime: 5 min)
- Components and page hooks must **not** import from `@/api/hooks/` — use feature data hooks in `hooks/data/` instead (see `react-hooks.md`)
