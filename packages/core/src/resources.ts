import { UnunuraIdentifier, UnunuraKeys, NULLABLE, isNumber, isBorderStyle, isNullable } from 'ununura-shared'
import { classesFromRawHtml, generateCss } from './ast'
import { getSupportedColor, getSupportedFont, getSupportedImage, getSupportedSizer } from './css'
import { appendGlobals } from './globals'
import { lex } from './lexer'
import { getCSS, resolveCssClass, getIdentifierInCSS } from './resolvers'

export const generateMultipleClass = (key: string) => {
  const [identifier, content] = key.split(UnunuraKeys.UniqueContext)
  const contents = content.split(' ')

  return getCSS(identifier as UnunuraIdentifier, contents)
}

export const generateUniqueClass = (key: string) => {
  const [identifier, content] = key.split(UnunuraKeys.UniqueContext)

  return getCSS(identifier as UnunuraIdentifier, [content])
}

export const generateCSSResources = (raw: string) => {
  const ast = classesFromRawHtml(raw)

  return ast.reduce((acc, cl) => {
    const generated = generateCss(lex(cl))

    return (acc += generated)
  }, '')
}

export const getResourcePaddingOrMargin = (identifier: UnunuraIdentifier, contents: string[]): string => {
  const isValidArgument = contents.length === 1 || contents.length === 2 || contents.length === 4

  if (!isValidArgument) return NULLABLE

  const setter = `
  ${isValidArgument ? `${getIdentifierInCSS(identifier)}:${contents.reduce((sum, acc) => (sum += ` ${acc}px`), '')};` : ''}
`

  return resolveCssClass(identifier, contents, setter)
}

export const getResourceBorder = (identifier: UnunuraIdentifier, contents: string[]): string => {
  const size = contents.find((c) => isNumber(c)) ?? NULLABLE
  const style = contents.find((c) => isBorderStyle(c)) ?? NULLABLE
  const color = getSupportedColor(contents)

  const inCss = getIdentifierInCSS(identifier)

  let setter = '\n'
  setter += !isNullable(style) ? `  ${inCss}: ${style};\n` : ''
  setter += !isNullable(color) ? `  ${inCss}-color: ${color};\n` : ''
  setter += !isNullable(size) ? `  ${inCss}-width: ${size}px;\n` : ''

  return resolveCssClass(identifier, contents, setter)
}

export const getResourceBackgroundColor = (identifier: UnunuraIdentifier, contents: string[]): string => {
  const color = getSupportedColor(contents)

  const inCss = getIdentifierInCSS(identifier)

  let setter = '\n'
  setter += !isNullable(color) ? `  ${inCss}-color: ${color};\n` : ''

  return resolveCssClass(identifier, contents, setter)
}

export const getResourceBackgroundImage = (identifier: UnunuraIdentifier, contents: string[]): string => {
  const image = getSupportedImage(contents)
  const inCss = getIdentifierInCSS(identifier)

  let setter = '\n'
  setter += !isNullable(image) ? `  ${inCss}: url("${image}");\n` : ''

  return resolveCssClass(identifier, contents, setter)
}

export const getResourceText = (identifier: UnunuraIdentifier, contents: string[]): string => {
  const color = getSupportedColor(contents)
  const fontSize = getSupportedSizer(contents)
  const fontFamily = getSupportedFont(contents)

  let setter = '\n'
  setter += !isNullable(color) ? `  color: ${color};\n` : ''
  setter += !isNullable(fontSize) ? `  font-size: ${fontSize};\n` : ''
  setter += !isNullable(fontFamily) ? `  font-family: '${fontFamily}', sans-serif;\n` : ''
  setter += appendGlobals(identifier, contents)

  return resolveCssClass(identifier, contents, setter)
}
