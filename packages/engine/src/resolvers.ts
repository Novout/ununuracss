import {
  UnunuraIdentifier,
  NULLABLE,
  Nullable,
  isNullable,
  isResponsiveContextIdentifier,
  isThemeContextIdentifier,
  UnunuraContextualizeResponsive,
  UnunuraGenerateContext,
} from 'ununura-shared'
import { purgeOnlyCssClassTitle } from './purge'
import {
  getResourceText,
  getResourceBorder,
  getResourceSpreadValues,
  getResourceFlex,
  getResourceWidthOrHeight,
  getResourceBackground,
  getResourcePosition,
  getResourceScroll,
  getResourceReset,
  getResourceShadow,
  getResourceCursor,
  getResourceFloat,
  getResourceDisplay,
  getResourceZIndex,
} from './resources'
import { TemplateClassResponsive } from './template'

export const resolveTitleToClassName = (t: string) => {
  return t
    .replace(/[.%\s]/gi, '') // defaults
    .replace(/[,_\s]/gi, '-')
    .replace(/[():#/\s]/gi, '')
    .replace(/ /gi, '')
    .replaceAll('?', '_none_') // globals
    .replaceAll('!', '_important_')
    .toLowerCase()
}

export const resolveIdentifierInCSS = (identifier: UnunuraIdentifier): string => {
  switch (identifier) {
    case UnunuraIdentifier.Margin:
      return 'margin'
    case UnunuraIdentifier.Padding:
      return 'padding'
    case UnunuraIdentifier.Background:
      return 'background'
    case UnunuraIdentifier.Text:
      return 'font'
    case UnunuraIdentifier.Border:
      return 'border'
    case UnunuraIdentifier.Flexbox:
      return 'flex'
    case UnunuraIdentifier.Height:
      return 'height'
    case UnunuraIdentifier.Width:
      return 'width'
    case UnunuraIdentifier.Position:
      return 'pos'
    case UnunuraIdentifier.Scroll:
      return 'scroll'
    case UnunuraIdentifier.Reset:
      return 'reset'
    case UnunuraIdentifier.Shadow:
      return 'shadow'
    case UnunuraIdentifier.Cursor:
      return 'cursor'
    case UnunuraIdentifier.Rounded:
      return 'border-radius'
    case UnunuraIdentifier.ZIndex:
      return 'z-index'
    case UnunuraIdentifier.Display:
      return 'display'
    case UnunuraIdentifier.Float:
      return 'float'
  }
}

export const resolveCSS = (identifier: UnunuraIdentifier, ctx: UnunuraGenerateContext): string => {
  switch (identifier) {
    case UnunuraIdentifier.Margin:
    case UnunuraIdentifier.Padding:
    case UnunuraIdentifier.Rounded:
      return getResourceSpreadValues(identifier, ctx)
    case UnunuraIdentifier.Height:
    case UnunuraIdentifier.Width:
      return getResourceWidthOrHeight(identifier, ctx)
    case UnunuraIdentifier.Background:
      return getResourceBackground(identifier, ctx)
    case UnunuraIdentifier.Text:
      return getResourceText(identifier, ctx)
    case UnunuraIdentifier.Border:
      return getResourceBorder(identifier, ctx)
    case UnunuraIdentifier.Flexbox:
      return getResourceFlex(identifier, ctx)
    case UnunuraIdentifier.Position:
      return getResourcePosition(identifier, ctx)
    case UnunuraIdentifier.Scroll:
      return getResourceScroll(identifier, ctx)
    case UnunuraIdentifier.Reset:
      return getResourceReset(identifier, ctx)
    case UnunuraIdentifier.Shadow:
      return getResourceShadow(identifier, ctx)
    case UnunuraIdentifier.Cursor:
      return getResourceCursor(identifier, ctx)
    case UnunuraIdentifier.ZIndex:
      return getResourceZIndex(identifier, ctx)
    case UnunuraIdentifier.Display:
      return getResourceDisplay(identifier, ctx)
    case UnunuraIdentifier.Float:
      return getResourceFloat(identifier, ctx)
    default:
      return NULLABLE
  }
}

export const resolveTitleCssClass = (identifier: UnunuraIdentifier, ctx: UnunuraGenerateContext): Nullable<string> => {
  const asTheme = ctx.stack?.find((c) => isThemeContextIdentifier(c))

  const asResponsive = ctx.stack?.find((c) => isResponsiveContextIdentifier(c))
  const buffered = asResponsive ? ctx.buffer?.find((c) => purgeOnlyCssClassTitle(c).startsWith(identifier)) : undefined

  if (asResponsive && !buffered) return NULLABLE

  let setter = !asResponsive
    ? ctx.contents.reduce(
        (sum, acc) => (sum += `-${resolveTitleToClassName(acc)}`),
        (asTheme ? `.${asTheme} ` : '') + `.${identifier}`
      )
    : (asTheme ? `.${asTheme} ` : '') + `.${purgeOnlyCssClassTitle(buffered as string)}`
  setter += asTheme ? `-${asTheme}` : ''

  return setter
}

export const resolveCssClass = (identifier: UnunuraIdentifier, setter: string, ctx: UnunuraGenerateContext): Nullable<string> => {
  const title = resolveTitleCssClass(identifier, ctx)

  if (isNullable(title)) return NULLABLE

  if (!setter.trim()) return NULLABLE

  const cl = `${title} {${setter}}`

  const asResponsive = ctx.stack?.find((c) => isResponsiveContextIdentifier(c))

  if (asResponsive) return TemplateClassResponsive(asResponsive as UnunuraContextualizeResponsive, cl)

  return cl
}
