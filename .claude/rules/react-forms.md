---
paths:
  - "src/**/schemas/**"
  - "src/components/Form/**"
  - "src/components/Input/**"
  - "src/components/Switch/**"
  - "src/components/Textarea/**"
  - "src/components/Checkbox/**"
  - "src/pages/**/hooks/**"
  - "src/pages/**/components/**"
---

# Form Conventions

Forms use **react-hook-form** + **zod** with a declarative field API. Hooks own form state and submit handlers; components render UI only.

## Schema files

Each form has a co-located schema in a `schemas/` folder next to the form (page or section):

```
pages/LoginPage/
  schemas/login-form.schema.ts
  hooks/useLoginPage.ts
  LoginPage.tsx
```

Use `defineFormSchema` / `createFormSchema` from `@/lib/form-schema` so the schema and inferred values type are returned together:

```ts
// Static schema (no i18n)
export const roleFormSchema = defineFormSchema(z.object({ name: z.string() }))
export type RoleFormValues = typeof roleFormSchema.values

// Factory when messages need t()
export const createLoginFormSchema = (t: TFunction) =>
  createFormSchema(() => z.object({ email: z.email(t('auth.validation.email')) }))
export type LoginFormValues = ReturnType<typeof createLoginFormSchema>['values']
```

Never inline zod schemas in hooks — keep them in `schemas/`.

Feature forms live in dedicated components next to the page/section (`LoginForm`, `RoleForm`, …). The page or dialog composes layout chrome; the form component owns `<Form>` markup and field wrappers.

## Form wrapper and context

Always wrap form markup in the shared `Form` component (`@/components/Form/Form`). It provides `FormProvider` and wires `handleSubmit`:

```tsx
const { form, onSubmit } = useLoginPage()

<Form form={form} onSubmit={onSubmit} className="space-y-4">
  <Input name="email" label={t('auth.login.email')} type="email" />
  <FormRootError />
  <Button type="submit">…</Button>
</Form>
```

Hooks return `form` and `onSubmit` — not `register`, not raw `submit` handlers.

Prefer `values` (controlled reset from server data) over `useEffect` + `reset` when the form mirrors fetched entities.

## Declarative fields (default)

Inside `Form`, bind fields by `name`. Shared wrappers connect to form context automatically and render label + error:

| Component | Import | Usage |
|-----------|--------|-------|
| `Input` | `@/components/Input/Input` | `<Input name="email" label={…} />` |
| `Textarea` | `@/components/Textarea/Textarea` | `<Textarea name="content" />` |
| `Switch` | `@/components/Switch/Switch` | `<Switch name="visibleForPm" label={…} />` |
| `Checkbox` | `@/components/Checkbox/Checkbox` | `<Checkbox name="agreed" label={…} />` |
| `Select` | `@/components/Select/Select` | `<Select name="status" label={…} options={…} />` |

- Field errors render below the control (`text-destructive`).
- Root / server errors: `<FormRootError />`.
- Override default change behavior with `onChange` / `onCheckedChange` on the field component.

## Imperative fields (when declarative is not enough)

Array-valued fields (permission keys, multi-select role IDs) or immediate side-effect toggles (note visibility saved on change) use `form.setValue` / `form.getValues` / `form.watch` in the hook, and **standalone** field components with explicit `checked` + `onCheckedChange`:

```tsx
<Checkbox
  checked={selectedKeys.includes(entry.key)}
  label={entry.label}
  onCheckedChange={() => togglePermission(entry.key)}
/>
```

Do not pass `name` when controlling the field imperatively.

## Imports

```tsx
// ✅ Shared wrappers
import { Input } from '@/components/Input/Input'
import { Form } from '@/components/Form/Form'

// ❌ shadcn primitives or raw HTML in app code
import { Input } from '@/components/ui/input'
<input type="checkbox" … />
<textarea … />
```

## Hook layering (unchanged)

Section/page hooks create `useForm`, call data hooks, expose `{ form, onSubmit, … }`. Components never import `@/api/hooks/` or call `useForm` directly.
