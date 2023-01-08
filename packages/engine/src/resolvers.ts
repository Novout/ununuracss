import { UnunuraIdentifier, NULLABLE, Nullable, UnunuraContextualizeStack } from 'ununura-shared'
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
} from './resources'

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
  }
}

export const resolveCSS = (identifier: UnunuraIdentifier, contents: string[], context?: UnunuraContextualizeStack): string => {
  switch (identifier) {
    case UnunuraIdentifier.Margin:
    case UnunuraIdentifier.Padding:
    case UnunuraIdentifier.Rounded:
      return getResourceSpreadValues(identifier, contents, context)
    case UnunuraIdentifier.Height:
    case UnunuraIdentifier.Width:
      return getResourceWidthOrHeight(identifier, contents, context)
    case UnunuraIdentifier.Background:
      return getResourceBackground(identifier, contents, context)
    case UnunuraIdentifier.Text:
      return getResourceText(identifier, contents, context)
    case UnunuraIdentifier.Border:
      return getResourceBorder(identifier, contents, context)
    case UnunuraIdentifier.Flexbox:
      return getResourceFlex(identifier, contents, context)
    case UnunuraIdentifier.Position:
      return getResourcePosition(identifier, contents, context)
    case UnunuraIdentifier.Scroll:
      return getResourceScroll(identifier, contents, context)
    case UnunuraIdentifier.Reset:
      return getResourceReset(identifier, contents, context)
    case UnunuraIdentifier.Shadow:
      return getResourceShadow(identifier, contents, context)
    case UnunuraIdentifier.Cursor:
      return getResourceCursor(identifier, contents, context)
    default:
      return NULLABLE
  }
}

export const resolveTitleCssClass = (identifier: UnunuraIdentifier, contents: string[], context?: UnunuraContextualizeStack) => {
  const asTheme = context?.find((c) => c === 'dark' || c === 'light' || c === 'sepia')

  let setter = contents.reduce(
    (sum, acc) => (sum += `-${resolveTitleToClassName(acc)}`),
    (asTheme ? `.${asTheme} ` : '') + `.${identifier}`
  )
  setter += asTheme ? `-${asTheme}` : ''

  return setter
}

export const resolveCssClass = (
  identifier: UnunuraIdentifier,
  contents: string[],
  setter: string,
  context?: UnunuraContextualizeStack
): Nullable<string> => {
  const title = resolveTitleCssClass(identifier, contents, context)

  if (!setter.trim()) return NULLABLE

  const cl = `${title} {${setter}}`

  return cl
}
