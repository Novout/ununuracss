import { Option, Symbol, TupleOption, UnunuraGenerateContext, UnunuraOptions } from 'ununura-shared'

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

export const enforceDefinesInLexer = (raw: string, ununura?: UnunuraOptions): string =>
  normalizeUnunuraOption<string>(ununura?.defines)?.reduce(
    (acc, [key, resources]) => acc.replaceAll(key as string, resources as string),
    raw
  ) ?? raw

export const getExtendedSupporterFontFamily = (ctx: UnunuraGenerateContext) => {
  const ExternalFont = normalizeUnunuraOption(ctx?.ununura?.extend?.supporters?.fonts)?.find(([key]) =>
    ctx.contents.some((v) => v === key)
  )

  return ExternalFont ? ExternalFont[1] : undefined
}

export const getExtendedSupporterColor = (ctx: UnunuraGenerateContext) => {
  const ExternalColor = normalizeUnunuraOption<string>(ctx?.ununura?.extend?.supporters?.colors)?.find(([key]) =>
    ctx.contents.some((v) => v === key)
  )

  return ExternalColor ? ExternalColor[1] : undefined
}

export const getExtendedSupporterUnits = (ctx: UnunuraGenerateContext) => {
  const ExternalUnit = normalizeUnunuraOption(ctx?.ununura?.extend?.supporters?.units)?.find(([key]) =>
    ctx.contents.some((v) => v === key)
  )

  return ExternalUnit ? ExternalUnit[1] : undefined
}
