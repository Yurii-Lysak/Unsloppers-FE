---
paths:
  - "src/pages/**"
---

# Page Conventions

## Structure

Each page is a scoped folder containing everything page-specific:

```
pages/
  AllEmployeesPage/
    AllEmployeesPage.tsx              # UI only — consumes useAllEmployeesPage
    hooks/
      useAllEmployeesPage.ts          # page hook — URL state + data hooks
    components/
      EmployeeTable/
        EmployeeTable.tsx
        hooks/
          useEmployeeTable.ts         # section hook (when needed)
```

- Naming: page `AllEmployeesPage` → hook `useAllEmployeesPage`
- Register routes in `src/router/index.tsx`; app routes render inside `AppLayout` wrapped by `ProtectedRoute`
- Permission-gated routes are declared in `src/router/route-permissions.ts` — `ProtectedRoute` enforces them before child routes render; page components must not check permissions
- Only create `hooks/`, `components/`, `helpers/` folders when there are files to put in them

## Three-layer data flow

```
Page component          → page hook only
Page hook               → data hooks (hooks/data/) + local UI state
Section component       → section hook only (for components with API/forms)
Section hook            → data hooks (hooks/data/) + form/local state
Data hook               → api/hooks/ primitives
```

**Never import `@/api/hooks/` or `@/hooks/data/` from a page or section component file.**

```tsx
// ❌ Page component calling data or API hooks directly
export const AllEmployeesPage = () => {
  const listQuery = useEmployeeList(query)          // wrong layer
  const { employeesList } = useEmployeesListData(q) // wrong layer
}

// ✅ Page component consumes page hook only
export const AllEmployeesPage = () => {
  const { employeesList, isEmployeesLoading, setPage } = useAllEmployeesPage()
  // ...
}
```

## Page hook responsibilities

The page hook owns:

- URL/search params, pagination, filters, dialog open/close state
- Calls to feature data hooks (`useEmployeesListData`, `usePermissionsData`, …)
- Derived display values computed from fetched data
- Navigation (`useNavigate`), route params (`useParams`) when page-specific

```tsx
// hooks/useAllEmployeesPage.ts
export const useAllEmployeesPage = () => {
  const query = useMemo(() => parseSearchParams(searchParams), [searchParams])
  const { employeesList, isEmployeesLoading, isEmployeesError } = useEmployeesListData(query)

  const displayData = employeesList
    ? buildDirectoryDisplayData(employeesList, visibleColumnIds)
    : undefined

  return {
    query,
    setPage,
    employeesList,
    isEmployeesLoading,
    isEmployeesError,
    displayData,
    // ...
  }
}
```

## Section hooks (page-local components)

When a page child component needs API data or mutations, extract a section hook next to it. The section hook consumes data hooks; the component stays UI-only.

```
components/
  FunctionalRolesAssignmentForm/
    FunctionalRolesAssignmentForm.tsx
    hooks/
      useFunctionalRolesAssignmentForm.ts   # consumes useEmployeeFunctionalRolesData, useFunctionalRolesListData
```

Mutations are always invoked through named handlers — either defined in the data hook (`saveEmployeeRoles`) or in the section/page hook that wraps them. Never call `mutation.mutate()` inline in JSX.

## When a page hook is NOT needed

Skip the hook if the page only renders static content, uses only global context, and has no local state, side effects, or API calls (e.g. current `HomePage`).
