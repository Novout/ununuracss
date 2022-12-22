import { UnunuraIdentifier, NULLABLE, UnunuraKeys, UNUNURA_IDENTIFIERS } from 'ununura-shared'
import { lex } from './lexer'
import {
  getResourceText,
  getResourceBackgroundColor,
  getResourceBackgroundImage,
  getResourceBorder,
  getResourcePaddingOrMargin,
  getResourceRadius,
} from './resources'

export const resolveFloatingToClassName = (t: string) =>
  t
    .replace(/[.\s]/gi, '')
    .replace(/[,\s]/gi, '-')
    .replace(/[()\s]/gi, '')
    .replaceAll('%', '')

export const getIdentifierInCSS = (identifier: UnunuraIdentifier): string => {
  switch (identifier) {
    case UnunuraIdentifier.Margin:
      return 'margin'
    case UnunuraIdentifier.Padding:
      return 'padding'
    case UnunuraIdentifier.BackgroundColor:
    case UnunuraIdentifier.BackgroundImage:
      return 'background'
    case UnunuraIdentifier.Text:
      return 'text'
    case UnunuraIdentifier.Border:
      return 'border'
    case UnunuraIdentifier.Radius:
      return 'radius'
  }
}

export const getCSS = (identifier: UnunuraIdentifier, contents: string[]): string => {
  switch (identifier) {
    case UnunuraIdentifier.Margin:
    case UnunuraIdentifier.Padding:
      return getResourcePaddingOrMargin(identifier, contents)
    case UnunuraIdentifier.BackgroundColor:
      return getResourceBackgroundColor(identifier, contents)
    case UnunuraIdentifier.BackgroundImage:
      return getResourceBackgroundImage(identifier, contents)
    case UnunuraIdentifier.Text:
      return getResourceText(identifier, contents)
    case UnunuraIdentifier.Border:
      return getResourceBorder(identifier, contents)
    case UnunuraIdentifier.Radius:
      return getResourceRadius(identifier, contents)
    default:
      return NULLABLE
  }
}

export const resolveTitleCssClass = (identifier: UnunuraIdentifier, contents: string[]) => {
  return contents.reduce((sum, acc) => {
    if (acc) return (sum += `-${resolveFloatingToClassName(acc)}`)

    return sum
  }, `.${identifier}`)
}

export const resolveCssClass = (identifier: UnunuraIdentifier, contents: string[], setter: string): string => {
  const title = resolveTitleCssClass(identifier, contents)

  const cl = `${title} {${setter}}`

  return cl
}

export const resolveUnunuraCssName = (raw: string): string => {
  const keys = lex(raw)
  const normalize = keys
    .join('')
    .replaceAll(/[:[\s]/gi, '-')
    .replaceAll(UnunuraKeys.MultipleContextClose, '')
    .split(/(m|p|r|border|text|bg|bgi)+/gi)
    .join()
    .replaceAll(/[,\s]/gi, ' ')
    .replaceAll(/ -/gi, '-')
    .trim()

  /*
  const setIdentifierSpace = (str: string) => {
    return str
      .replaceAll(UnunuraIdentifier.BackgroundColor, ` ${UnunuraIdentifier.BackgroundColor}`)
      .replaceAll(UnunuraIdentifier.BackgroundImage, ` ${UnunuraIdentifier.BackgroundImage}`)
      .replaceAll(UnunuraIdentifier.Border, ` ${UnunuraIdentifier.Border}`)
      .replaceAll(UnunuraIdentifier.Margin, ` ${UnunuraIdentifier.Margin}`)
      .replaceAll(UnunuraIdentifier.Padding, ` ${UnunuraIdentifier.Padding}`)
      .replaceAll(UnunuraIdentifier.Text, ` ${UnunuraIdentifier.Text}`)
      .replaceAll(UnunuraIdentifier.Radius, ` ${UnunuraIdentifier.Radius}`)
      .trim()
  }
  */

  return normalize
}
