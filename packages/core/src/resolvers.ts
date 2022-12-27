import { UnunuraIdentifier, NULLABLE, Nullable } from 'ununura-shared'
import {
  getResourceText,
  getResourceBorder,
  getResourcePaddingOrMargin,
  getResourceFlex,
  getResourceWidthOrHeight,
  getResourceBackground,
  getResourcePosition,
} from './resources'

export const resolveTitleToClassName = (t: string) =>
  t
    .replace(/[.%\s]/gi, '') // defaults
    .replace(/[,_\s]/gi, '-')
    .replace(/[():#/\s]/gi, '')
    .replaceAll('?', '_none_') // globals
    .replaceAll('!', '_important_')
    .toLowerCase()

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
  }
}

export const resolveCSS = (identifier: UnunuraIdentifier, contents: string[]): string => {
  switch (identifier) {
    case UnunuraIdentifier.Margin:
    case UnunuraIdentifier.Padding:
      return getResourcePaddingOrMargin(identifier, contents)
    case UnunuraIdentifier.Background:
      return getResourceBackground(identifier, contents)
    case UnunuraIdentifier.Text:
      return getResourceText(identifier, contents)
    case UnunuraIdentifier.Border:
      return getResourceBorder(identifier, contents)
    case UnunuraIdentifier.Flexbox:
      return getResourceFlex(identifier, contents)
    case UnunuraIdentifier.Height:
    case UnunuraIdentifier.Width:
      return getResourceWidthOrHeight(identifier, contents)
    case UnunuraIdentifier.Position:
      return getResourcePosition(identifier, contents)
    default:
      return NULLABLE
  }
}

export const resolveTitleCssClass = (identifier: UnunuraIdentifier, contents: string[]) => {
  return contents.reduce((sum, acc) => (sum += `-${resolveTitleToClassName(acc)}`), `.${identifier}`)
}

export const resolveCssClass = (identifier: UnunuraIdentifier, contents: string[], setter: string): Nullable<string> => {
  const title = resolveTitleCssClass(identifier, contents)

  if (!setter.trim()) return NULLABLE

  const cl = `${title} {${setter}}`

  return cl
}
