---
paths:
  - "src/api/**"
---

# API Layer Conventions

Four layers — keep each in its place:

```
api/client.ts              → ApiClient singleton (axios wrapper)
api/services/*.service.ts  → Feature ApiService singletons (HTTP calls)
api/hooks/*.ts             → thin TanStack Query primitives (useQuery / useMutation)
hooks/data/*.ts            → feature data hooks (see react-hooks.md)
```

**All HTTP must go through TanStack Query.** Components and page hooks never call `apiClient` or ApiService methods directly — only `api/hooks/` and `hooks/data/` do.

## ApiClient (`api/client.ts`)

- Single configured axios instance: the `apiClient` singleton (baseURL/timeout from `config/env.ts`). Don't create additional axios instances
- Auth headers are wired via cookie session (`withCredentials: true`); `onUnauthorized` listeners purge protected cache
- Never import `apiClient` outside `src/api/` (except `AuthContext` for the unauthorized interceptor)

## ApiService singletons (`api/services/*.service.ts`)

One service class per feature domain. Each file exports a single singleton instance.

**Naming:**

| Item | Pattern | Example |
|------|---------|---------|
| Class | `<FeatureName>ApiService` | `EmployeeApiService` |
| File | `<feature>.service.ts` | `employee.service.ts` |
| Export | camelCase singleton | `employeeApiService` |

**Structure:**

```ts
// api/services/employee.service.ts
import { apiClient } from '@/api/client'
import type { EmployeeListQuery, EmployeeListResponse } from '@/types/employees'

class EmployeeApiService {
  public getEmployeesList(query: EmployeeListQuery): Promise<EmployeeListResponse> {
    return apiClient.get<EmployeeListResponse>('/api/v1/employees', {
      params: { /* map query */ },
    })
  }

  public getEmployee(employeeId: string): Promise<EmployeeSummary> {
    return apiClient.get<EmployeeSummary>(`/api/v1/employees/${employeeId}`)
  }

  public createEmployee(input: CreateEmployeeInput): Promise<Employee> {
    return apiClient.post<Employee>('/api/v1/employees', input)
  }

  public updateEmployee(id: string, input: UpdateEmployeeInput): Promise<Employee> {
    return apiClient.patch<Employee>(`/api/v1/employees/${id}`, input)
  }

  public deleteEmployee(id: string): Promise<void> {
    return apiClient.delete<void>(`/api/v1/employees/${id}`)
  }
}

export const employeeApiService = new EmployeeApiService()
```

**Rules:**

- One class per feature — group all CRUD and list endpoints for that domain in the same service
- Public methods named after the operation (`getEmployeesList`, `createEmployee`, `updateEmployee`, `deleteEmployee`) — no `ApiCall` suffix
- Methods return the typed `Promise` from `apiClient` — no extra wrapping
- Shared request/response types live in `src/types/`
- Services are stateless — no instance fields beyond what the class needs internally
- Export only the singleton instance, not the class (keeps imports consistent)

**Legacy `*ApiCall` functions** in `api/*.ts` are deprecated — migrate to ApiService when touching a file.

## Query primitives (`api/hooks/*.ts`)

- One hook per operation — **low-level** wrappers, not consumed directly by page or section components
- `useQuery` for GET requests; `useMutation` for create / edit / delete
- Export stable query keys alongside hooks (e.g. `employeeListQueryKey`) — used for cache invalidation
- Use stable, descriptive query keys (`['employees', 'list', query]`, `['employees', employeeId, 'profile']`)

**queryFn must delegate to the ApiService method.** Pass the method reference directly when it needs no extra args; use an arrow function when parameters are required:

```tsx
// api/hooks/useEmployeeList.ts
import { employeeApiService } from '@/api/services/employee.service'

export const employeeListQueryKey = (query: EmployeeListQuery) =>
  ['employees', 'list', query] as const

export const useEmployeeList = (query: EmployeeListQuery) =>
  useQuery({
    queryKey: employeeListQueryKey(query),
    queryFn: () => employeeApiService.getEmployeesList(query),
  })
```

```tsx
// api/hooks/useFunctionalRoles.ts — no-arg queryFn can use method reference
export const useFunctionalRolesList = (enabled: boolean) =>
  useQuery({
    queryKey: functionalRolesQueryKey,
    queryFn: functionalRoleApiService.getFunctionalRolesList,
    enabled,
  })
```

## Mutations (`useMutation`)

Every mutation hook **must** define `onSuccess` and `onError` callbacks that show a toast to the user.

- `onSuccess`: confirm the entity was created / updated / deleted (i18n key)
- `onError`: indicate the operation failed (i18n key)
- `onSuccess` also invalidates or updates the relevant query cache

Use the project's toast utility (add via `npx shadcn@latest add sonner` when not yet installed; wire `<Toaster />` in `App.tsx`). Never hardcode user-facing toast text — use i18n keys from `src/locales/en/translation.json`.

```tsx
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { functionalRoleApiService } from '@/api/services/functional-role.service'

export const useCreateFunctionalRole = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateFunctionalRoleInput) =>
      functionalRoleApiService.createFunctionalRole(input),
    onSuccess: async () => {
      toast.success(t('functionalRoles.create.success'))
      await queryClient.invalidateQueries({ queryKey: functionalRolesQueryKey })
    },
    onError: () => {
      toast.error(t('functionalRoles.create.error'))
    },
  })
}
```

**Auth-flow mutations** (login/logout) may omit entity toasts — they surface errors through the auth context UI instead.

- The `QueryClient` is configured in `src/main.tsx` (retry: 1, staleTime: 5 min)
- Components and page hooks must **not** import from `@/api/hooks/` — use feature data hooks in `hooks/data/` instead (see `react-hooks.md`)
