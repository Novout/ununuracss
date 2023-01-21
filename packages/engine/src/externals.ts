import { UnunuraGenerateContext, UnunuraOptions } from 'ununura-shared'

export const enforceDefinesInLexer = (raw: string, ununura?: UnunuraOptions): string =>
  ununura?.defines?.reduce((acc, [key, resources]) => acc.replaceAll(key, resources), raw) ?? raw

export const getExtendedSupporterFontFamily = (ctx: UnunuraGenerateContext) => {
  const ExternalFont = ctx?.ununura?.extend?.supporters?.fontFamily?.find(([key]) => ctx.contents.some((v) => v === key))

  return ExternalFont ? ExternalFont[1] : undefined
}

export const getExtendedSupporterFontSize = (ctx: UnunuraGenerateContext) => {
  const ExternalSize = ctx?.ununura?.extend?.supporters?.fontSize?.find(([key]) => ctx.contents.some((v) => v === key))

  return ExternalSize ? ExternalSize[1] : undefined
}

export const getExtendedSupporterColor = (ctx: UnunuraGenerateContext) => {
  const ExternalColor = ctx?.ununura?.extend?.supporters?.colors?.find(([key]) => ctx.contents.some((v) => v === key))

  return ExternalColor ? ExternalColor[1] : undefined
}
