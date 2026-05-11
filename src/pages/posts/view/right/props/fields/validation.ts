import { z } from 'zod'

export const SlugSchema = z
  .string()
  .max(100, 'slug 过长')
  .regex(/^[a-z0-9-]+$/, '仅 a-z 0-9 -')
  .optional()
  .or(z.literal(''))

export const SummarySchema = z
  .string()
  .max(500, '过长（≤500）')
  .nullish()

export const TagsSchema = z
  .array(z.string().max(32, 'tag 过长（≤32）'))
  .max(20, 'tag 过多（≤20）')

export const PinOrderSchema = z
  .number()
  .int('须为整数')
  .min(0, '须 ≥ 0')
  .optional()

export const TitleSchema = z
  .string()
  .min(1, '不可空')
  .max(200, '过长（≤200）')

export const PostQuickEditSchema = z.object({
  title: TitleSchema,
  slug: SlugSchema,
  summary: SummarySchema,
  tags: TagsSchema,
  pinOrder: PinOrderSchema,
})

const firstError = (
  res: { success: true } | { success: false; error: { issues: { message: string }[] } },
): string | null => {
  if (res.success) return null
  return res.error.issues[0]?.message ?? '无效'
}

export const validateSlug = (v: string): string | null =>
  firstError(SlugSchema.safeParse(v))

export const validateTitle = (v: string): string | null =>
  firstError(TitleSchema.safeParse(v))

export const validateSummary = (v: string | null | undefined): string | null =>
  firstError(SummarySchema.safeParse(v))

export const validateTags = (v: string[]): string | null =>
  firstError(TagsSchema.safeParse(v))

export const validatePinOrder = (v: number | undefined): string | null =>
  firstError(PinOrderSchema.safeParse(v))
