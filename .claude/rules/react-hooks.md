---
paths:
  - "src/hooks/**"
---

# Hook Conventions

## Two hook locations

| Location | Purpose |
|----------|---------|
| `src/hooks/data/` | Feature data hooks — aggregate queries/mutations for a domain |
| `src/hooks/` | Global reusable hooks not tied to a feature (e.g. `useLocalStorage`) |

Page-specific and component-specific hooks belong in that page's or component's `hooks/` folder — not here.

## Feature data hooks (`hooks/data/`)

Data hooks sit between query primitives (`api/hooks/`) and page/section hooks. One file per feature domain:

```
hooks/data/
  useEmployeesData.ts       # employees list, profile, functional-role assignment
  usePermissionsData.ts     # my permissions, permission catalog
  useFunctionalRolesData.ts # roles list, create/update mutations
  useManagementNotesData.ts # create/update/delete management notes
```

Each data hook:

- Calls the matching `@/api/hooks/*` primitives internally
- Destructures query results with explicit names — never return a raw query object
- Wraps every mutation in a named async handler that calls `mutateAsync`

```tsx
// hooks/data/useEmployeesData.ts
export const useEmployeesListData = (query: EmployeeListQuery) => {
  const {
    data: employeesList,
    isLoading: isEmployeesLoading,
    isError: isEmployeesError,
  } = useEmployeeList(query)

  return { employeesList, isEmployeesLoading, isEmployeesError }
}

export const useEmployeeFunctionalRolesData = (employeeId: string, enabled: boolean) => {
  const { data: assignedRoles, isLoading: isAssignedRolesLoading, isError: isAssignedRolesError } =
    useEmployeeFunctionalRoles(employeeId, enabled)

  const saveRolesMutation = useSetEmployeeFunctionalRoles(employeeId)

  const saveEmployeeRoles = async (roleIds: string[]) => {
    await saveRolesMutation.mutateAsync(roleIds)
  }

  return {
    assignedRoles,
    isAssignedRolesLoading,
    isAssignedRolesError,
    saveEmployeeRoles,
    isSavingRoles: saveRolesMutation.isPending,
  }
}
```

**Naming:** file `use<Feature>Data.ts`; exported hooks name the specific operation (`useEmployeesListData`, `usePermissionsData`).

**Who consumes data hooks:** page hooks and section/component hooks only — never page or section components directly.

## Global hooks (`src/hooks/`)

- One hook per file, file named after the hook: `useLocalStorage.ts`
- Type generically where it makes sense (`useLocalStorage<T>`)
- No JSX in these hooks — if a hook needs to render something, it's a component
- No API calls here — those belong in `hooks/data/`
