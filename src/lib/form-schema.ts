import type { z } from 'zod'

export const defineFormSchema = <TSchema extends z.ZodType>(schema: TSchema) => ({
  schema,
  values: undefined as z.infer<TSchema>,
})

export const createFormSchema = <TSchema extends z.ZodType>(buildSchema: () => TSchema) => {
  const schema = buildSchema()
  return defineFormSchema(schema)
}
