import { DEFAULT_UNIT, Option, Symbol, TupleOption, UnunuraGenerateContext, UnunuraOptions } from 'ununura-shared'
import { lexToRawTitles } from './lexer'

export function normalizeUnunuraOption<T extends Symbol>(item?: Option<T>): TupleOption<T> {
  if (!item) return []

  if (Array.isArray(item)) return item

  return Object.entries(item).reduce((acc, target) => {
    const [key, stringOrObject] = target

    if (typeof stringOrObject === 'string') acc.push([key, stringOrObject] as any)
    if (typeof stringOrObject === 'object') acc.push([key as any, stringOrObject.value, stringOrObject.options])

    return acc
  }, [] as TupleOption<T>)
}

export const enforceDefinesInLexer = (raw: string, ununura?: UnunuraOptions): string => {
  const defines = normalizeUnunuraOption<string>(ununura?.defines)

  if (defines.length === 0) return raw

  const keys = lexToRawTitles(raw)

  return keys
    .map((key) => {
      const asDefine = defines.find(([it]) => it === key)

      return asDefine ? asDefine[1] : key
    })
    .join(' ')
}

export const getExtendedSupporterFontFamily = (ctx: UnunuraGenerateContext) => {
  const ExternalFont = normalizeUnunuraOption(ctx?.ununura?.extend?.supporters?.fonts)?.find(([key]) =>
    ctx.contents.some((v) => v === key)
  )

  return ExternalFont ? ExternalFont[1] : undefined
}

export const getExtendedContextResponsive = (ctx: UnunuraGenerateContext) => {
  const ExternalContext = normalizeUnunuraOption(ctx?.ununura?.extend?.contexts?.responsive)?.find(([key]) =>
    ctx.stack.some((v) => v === key)
  )

  return ExternalContext ? ExternalContext[1] : undefined
}

export const getExtendedContextTheme = (ctx: UnunuraGenerateContext) => {
  const ExternalContext = ctx?.ununura?.extend?.contexts?.theme?.find((key) => ctx.stack.some((v) => v === key))

  return ExternalContext || undefined
}

export const getExtendedSupporterColor = (ctx: UnunuraGenerateContext) => {
  const ExternalColor = normalizeUnunuraOption<string>(ctx?.ununura?.extend?.supporters?.colors)?.find(([key]) =>
    ctx.contents.some((v) => v === key)
  )

  if (!ExternalColor) return undefined

  const [_, value, options] = ExternalColor

  if (options?.type === 'var') {
    return `var(${value})`
  }

  return value ?? undefined
}

export const getExtendedSupporterUnits = (ctx: UnunuraGenerateContext) => {
  const ExternalUnit = normalizeUnunuraOption(ctx?.ununura?.extend?.supporters?.units)?.find(([key]) =>
    ctx.contents.some((v) => v === key)
  )

  if (!ExternalUnit) return undefined

  const [_, value] = ExternalUnit

  return value ?? undefined
}

export const getExistentDefaultUnit = (ctx: UnunuraGenerateContext): [string, number] => {
  const ExternalDef = normalizeUnunuraOption<string | number>(ctx?.ununura?.defaults?.values?.unit)

  if (!ExternalDef || ExternalDef.length === 0) return DEFAULT_UNIT

  return [ExternalDef[0], ExternalDef[1]] as any
}
