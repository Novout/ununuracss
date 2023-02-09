import {
  isResponsiveContextIdentifier,
  UnunuraGenerateContext,
  UnunuraOptions,
  isIdentifier,
  isThemeContextIdentifier,
} from 'ununura-shared'
import { getExtendedContextResponsive, getExtendedContextTheme, normalizeUnunuraOption } from './externals'

export const asResponsiveInContext = (ctx: UnunuraGenerateContext) => {
  return getExtendedContextResponsive(ctx) ?? ctx.stack?.find((c) => isResponsiveContextIdentifier(c))
}

export const asThemeInContext = (ctx: UnunuraGenerateContext) => {
  return getExtendedContextTheme(ctx) ?? ctx.stack?.find((c) => isThemeContextIdentifier(c))
}

export const isExistentIdentifier = (target: string, ununura: UnunuraOptions) => {
  const isCustomContextResponsive = normalizeUnunuraOption(ununura?.extend?.contexts?.responsive)?.some(([key]) => key === target)
  const isCustomContextTheme = ununura?.extend?.contexts?.theme?.some((key) => key === target)

  return isCustomContextResponsive || isCustomContextTheme || isIdentifier(target)
}
