import {
  UnunuraIdentifier,
  UnunuraKeys,
  NULLABLE,
  isBorderStyle,
  isNullable,
  Option,
  findResource,
  findResourceInStart,
} from 'ununura-shared'
import { classesFromRawHtml, generateCss } from './ast'
import {
  getSupportedColor,
  getSupportedFlexDirection,
  getSupportedFlexGap,
  getSupportedFlexGrow,
  getSupportedFlexHorizontal,
  getSupportedFlexVertical,
  getSupportedFlexWrap,
  getSupportedFont,
  getSupportedFontWeight,
  getSupportedGlobalImportant,
  getSupportedGlobalNone,
  getSupportedImage,
  getSupportedImageRepeat,
  getSupportedImageSize,
  getSupportedMinOrMax,
  getSupportedNumber,
  getSupportedScroll,
  getSupportedScrollDirection,
  getSupportedStandardFlex,
} from './support'
import { lex } from './lexer'
import { resolveCSS, resolveCssClass, resolveIdentifierInCSS } from './resolvers'
import { validateSpreadAllResource } from './validate'

export const setterHead = (contents: string[], start?: string) => {
  const asDef = getSupportedGlobalNone(contents)

  let _ = '\n' + (start && isNullable(asDef) ? `  ${start}\n` : '')

  return _
}

export const setterRow = (item: Option<string> = undefined, valid: string, contents: string[]) => {
  const asImportant = getSupportedGlobalImportant(contents)

  return !isNullable(item) ? `  ${valid}${!isNullable(asImportant) ? ' !important' : ''};\n` : ''
}

export const generateMultipleClass = (key: string) => {
  const [identifier, content] = key.split(UnunuraKeys.UniqueContext)
  const contents = content.split(' ')

  return resolveCSS(identifier as UnunuraIdentifier, contents)
}

export const generateUniqueClass = (key: string) => {
  const [identifier, content] = key.split(UnunuraKeys.UniqueContext)

  return resolveCSS(identifier as UnunuraIdentifier, [content])
}

export const generateCSSResources = (raw: string) => {
  const ast = classesFromRawHtml(raw)

  return ast.reduce((acc, cl) => {
    const generated = generateCss(lex(cl))

    return (acc += generated)
  }, '')
}

export const getResourcePaddingOrMargin = (identifier: UnunuraIdentifier, contents: string[]): string => {
  const values = validateSpreadAllResource(contents)

  if (values.length === 0) return NULLABLE

  let setter = setterHead(contents)

  const spread = `${resolveIdentifierInCSS(identifier)}:${values.reduce(
    (sum, acc) => (sum += ` ${getSupportedNumber([acc])}`),
    ''
  )}`

  setter += setterRow('' as any, spread, contents)

  return resolveCssClass(identifier, contents, setter)
}

export const getResourceWidthOrHeight = (identifier: UnunuraIdentifier, contents: string[]): string => {
  const size = getSupportedNumber(contents)
  const ranged = getSupportedMinOrMax(contents)

  const inCss = resolveIdentifierInCSS(identifier)

  let setter = setterHead(contents)
  ranged
    ? (setter +=
        !isNullable(ranged) && !isNullable(size)
          ? setterRow('' as any, `${ranged}-${inCss}: ${size}`, contents)
          : !isNullable(size)
          ? setterRow('' as any, `${inCss}: ${size}`, contents)
          : '')
    : ''

  return resolveCssClass(identifier, contents, setter)
}

export const getResourcePosition = (identifier: UnunuraIdentifier, contents: string[]): string => {
  const base = findResource(contents, ['static', 'relative', 'fixed', 'absolute', 'sticky'])

  const left = findResourceInStart(contents, ['left-'])
  const right = findResourceInStart(contents, ['right-'])
  const top = findResourceInStart(contents, ['top-'])
  const bottom = findResourceInStart(contents, ['bottom-'])

  if (!base) return NULLABLE

  let setter = setterHead(contents)
  setter += setterRow(base, `position: ${base}`, contents)
  setter += setterRow(left, `left: ${left.split('-')[1]}`, contents)
  setter += setterRow(right, `right: ${right.split('-')[1]}`, contents)
  setter += setterRow(top, `top: ${top.split('-')[1]}`, contents)
  setter += setterRow(bottom, `bottom: ${bottom.split('-')[1]}`, contents)

  return resolveCssClass(identifier, contents, setter)
}

export const getResourceBorder = (identifier: UnunuraIdentifier, contents: string[]): string => {
  const size = getSupportedNumber(contents)
  const style = contents.find((c) => isBorderStyle(c)) ?? NULLABLE
  const color = getSupportedColor(contents)

  const inCss = resolveIdentifierInCSS(identifier)

  let setter = setterHead(contents)
  setter += setterRow(style, `${inCss}: ${style}`, contents)
  setter += setterRow(color, `${inCss}-color: ${color}`, contents)
  setter += setterRow(size, `${inCss}-width: ${size}`, contents)

  return resolveCssClass(identifier, contents, setter)
}

export const getResourceBackground = (identifier: UnunuraIdentifier, contents: string[]): string => {
  const color = getSupportedColor(contents)
  const image = getSupportedImage(contents)
  const size = getSupportedImageSize(contents)
  const repeat = getSupportedImageRepeat(contents)

  const inCss = resolveIdentifierInCSS(identifier)

  let setter = setterHead(contents)
  setter += setterRow(color, `${inCss}-color: ${color}`, contents)
  setter += setterRow(image, `${inCss}-image: url("${image}")`, contents)
  setter += setterRow(size, `${inCss}-size: ${size}`, contents)
  setter += setterRow(repeat, `${inCss}-repeat: ${repeat}`, contents)

  return resolveCssClass(identifier, contents, setter)
}

export const getResourceScroll = (identifier: UnunuraIdentifier, contents: string[]): string => {
  const scroll = getSupportedScroll(contents)
  const scrollDirection = getSupportedScrollDirection(contents)

  let setter = setterHead(contents)
  setter += setterRow(scroll, `overflow${scrollDirection}: ${scroll}`, contents)

  return resolveCssClass(identifier, contents, setter)
}

export const getResourceText = (identifier: UnunuraIdentifier, contents: string[]): string => {
  const color = getSupportedColor(contents)
  const fontSize = getSupportedNumber(contents)
  const fontFamily = getSupportedFont(contents)
  const fontWeight = getSupportedFontWeight(contents)

  let setter = setterHead(contents)
  setter += setterRow(color, `color: ${color}`, contents)
  setter += setterRow(fontSize, `font-size: ${fontSize}`, contents)
  setter += setterRow(fontWeight, `font-weight: ${fontWeight}`, contents)
  setter += setterRow(fontFamily, `font-family: '${fontFamily}', sans-serif`, contents)

  return resolveCssClass(identifier, contents, setter)
}

export const getResourceFlex = (identifier: UnunuraIdentifier, contents: string[]): string => {
  const direction = getSupportedFlexDirection(contents)
  const grow = getSupportedFlexGrow(contents)
  const wrap = getSupportedFlexWrap(contents)
  const flex = getSupportedStandardFlex(contents)
  const gap = getSupportedFlexGap(contents)
  const horizontal = getSupportedFlexHorizontal(contents).replace(/h-/, '')
  const vertical = getSupportedFlexVertical(contents).replace(/v-/, '')

  let setter = setterHead(contents, 'display: flex;')
  setter += setterRow(direction, `${identifier}-direction: ${direction}`, contents)
  setter += setterRow(grow, `${identifier}-grow: ${grow}`, contents)
  setter += setterRow(wrap, `${identifier}-wrap: ${wrap}`, contents)
  setter += setterRow(flex, `${identifier}: ${flex.split('-')[1]} ${flex.split('-')[1]} 0%`, contents)
  setter += setterRow(gap, `gap: ${gap.split('-')[1]}`, contents)
  setter += setterRow(horizontal, `justify-content: ${horizontal}`, contents)
  setter += setterRow(vertical, `align-items: ${vertical}`, contents)

  return resolveCssClass(identifier, contents, setter)
}
