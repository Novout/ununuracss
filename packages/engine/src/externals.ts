import { UnunuraGenerateContext, UnunuraOptions } from 'ununura-shared'

export const enforceDefinesInLexer = (raw: string, ununura?: UnunuraOptions): string =>
  ununura?.defines?.reduce((acc, [key, resources]) => acc.replaceAll(key, resources), raw) ?? raw

export const getExtendedSupporterFontFamily = (ctx: UnunuraGenerateContext) => {
  const ExternalFont = ctx?.ununura?.extend?.supporters?.fonts?.find(([key]) => ctx.contents.some((v) => v === key))

  return ExternalFont ? ExternalFont[1] : undefined
}

export const getExtendedSupporterColor = (ctx: UnunuraGenerateContext) => {
  const ExternalColor = ctx?.ununura?.extend?.supporters?.colors?.find(([key]) => ctx.contents.some((v) => v === key))

  return ExternalColor ? ExternalColor[1] : undefined
}

export const getExtendedSupporterUnits = (ctx: UnunuraGenerateContext) => {
  const ExternalUnit = ctx?.ununura?.extend?.supporters?.units?.find(([key]) => ctx.contents.some((v) => v === key))

  return ExternalUnit ? ExternalUnit[1] : undefined
}
