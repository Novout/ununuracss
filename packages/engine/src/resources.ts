import {
  UnunuraIdentifier,
  UnunuraKeys,
  NULLABLE,
  isBorderStyle,
  isNullable,
  Option,
  findResource,
  findResourceInStart,
  isSlashImage,
  ANTIALIASED_RESET_CSS,
  MEYER_RESET_CSS,
  NOVOUT_RESET_CSS,
  UnunuraContextualizeStack,
} from 'ununura-shared'
import { classesFromRawHtml, generateCss } from './ast'
import {
  getSupportedColor,
  getSupportedCursor,
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
  getSupportedInteger,
  getSupportedMinOrMax,
  getSupportedNumber,
  getSupportedScroll,
  getSupportedScrollDirection,
  getSupportedStandardFlex,
} from './support'
import { lex } from './lexer'
import { resolveCSS, resolveCssClass, resolveIdentifierInCSS } from './resolvers'
import { validateSpreadAllResource } from './validate'

export const generateMultipleClass = (key: [string, string], context?: UnunuraContextualizeStack) => {
  const [identifier, content] = key
  const contents = content.split(' ')

  return resolveCSS(identifier as UnunuraIdentifier, contents, context)
}

export const generateUniqueClass = (key: [string, string], context?: UnunuraContextualizeStack) => {
  const [identifier, content] = key

  return resolveCSS(identifier as UnunuraIdentifier, [content], context)
}

export const setterHead = (contents: string[], context?: UnunuraContextualizeStack, start?: string) => {
  const asDef = getSupportedGlobalNone(contents)

  let _ = '\n' + (start && isNullable(asDef) ? `  ${start}\n` : '')

  return _
}

export const setterRow = (item: Option<string> = undefined, valid: string, contents: string[]) => {
  const asImportant = getSupportedGlobalImportant(contents)

  return !isNullable(item) ? `  ${valid}${!isNullable(asImportant) ? ' !important' : ''};\n` : ''
}

export const generateCSSResources = (raw: string) => {
  const ast = classesFromRawHtml(raw)

  return ast.reduce((acc, cl) => {
    const generated = generateCss(lex(cl))

    return (acc += generated)
  }, '')
}

export const getResourceSpreadValues = (
  identifier: UnunuraIdentifier,
  contents: string[],
  context?: UnunuraContextualizeStack
): string => {
  const values = validateSpreadAllResource(contents)

  if (values.length === 0) return NULLABLE

  let setter = setterHead(contents, context)

  const spread = `${resolveIdentifierInCSS(identifier)}:${values.reduce(
    (sum, acc) => (sum += ` ${getSupportedNumber([acc])}`),
    ''
  )}`

  setter += setterRow('' as any, spread, contents)

  return resolveCssClass(identifier, contents, setter, context)
}

export const getResourceWidthOrHeight = (
  identifier: UnunuraIdentifier,
  contents: string[],
  context?: UnunuraContextualizeStack
): string => {
  const size = getSupportedNumber(contents)
  const ranged = getSupportedMinOrMax(contents)

  const inCss = resolveIdentifierInCSS(identifier)

  let setter = setterHead(contents, context)
  ranged
    ? (setter +=
        !isNullable(ranged) && !isNullable(size)
          ? setterRow('' as any, `${ranged}-${inCss}: ${size}`, contents)
          : !isNullable(size)
          ? setterRow('' as any, `${inCss}: ${size}`, contents)
          : '')
    : ''

  return resolveCssClass(identifier, contents, setter, context)
}

export const getResourcePosition = (
  identifier: UnunuraIdentifier,
  contents: string[],
  context?: UnunuraContextualizeStack
): string => {
  const base = findResource(contents, ['static', 'relative', 'fixed', 'absolute', 'sticky'])

  const left = findResourceInStart(contents, ['left-'])
  const right = findResourceInStart(contents, ['right-'])
  const top = findResourceInStart(contents, ['top-'])
  const bottom = findResourceInStart(contents, ['bottom-'])

  if (!base) return NULLABLE

  let setter = setterHead(contents, context)
  setter += setterRow(base, `position: ${base}`, contents)
  setter += setterRow(left, `left: ${left.split('-')[1]}`, contents)
  setter += setterRow(right, `right: ${right.split('-')[1]}`, contents)
  setter += setterRow(top, `top: ${top.split('-')[1]}`, contents)
  setter += setterRow(bottom, `bottom: ${bottom.split('-')[1]}`, contents)

  return resolveCssClass(identifier, contents, setter, context)
}

export const getResourceBorder = (
  identifier: UnunuraIdentifier,
  contents: string[],
  context?: UnunuraContextualizeStack
): string => {
  const size = getSupportedNumber(contents)
  const style = contents.find((c) => isBorderStyle(c)) ?? NULLABLE
  const color = getSupportedColor(contents)

  const inCss = resolveIdentifierInCSS(identifier)

  let setter = setterHead(contents, context)
  setter += setterRow(style, `${inCss}: ${style}`, contents)
  setter += setterRow(color, `${inCss}-color: ${color}`, contents)
  setter += setterRow(size, `${inCss}-width: ${size}`, contents)

  return resolveCssClass(identifier, contents, setter, context)
}

export const getResourceBackground = (
  identifier: UnunuraIdentifier,
  contents: string[],
  context?: UnunuraContextualizeStack
): string => {
  const color = getSupportedColor(contents)
  const image = getSupportedImage(contents)
  const size = getSupportedImageSize(contents)
  const repeat = getSupportedImageRepeat(contents)

  const inCss = resolveIdentifierInCSS(identifier)

  let setter = setterHead(contents, context)
  setter += setterRow(color, `${inCss}-color: ${color}`, contents)
  setter += setterRow(image, `${inCss}-image: url("${isSlashImage(image) ? 'https:' : ''}${image}")`, contents)
  setter += setterRow(size, `${inCss}-size: ${size}`, contents)
  setter += setterRow(repeat, `${inCss}-repeat: ${repeat}`, contents)

  return resolveCssClass(identifier, contents, setter, context)
}

export const getResourceScroll = (
  identifier: UnunuraIdentifier,
  contents: string[],
  context?: UnunuraContextualizeStack
): string => {
  const scroll = getSupportedScroll(contents)
  const scrollDirection = getSupportedScrollDirection(contents)

  let setter = setterHead(contents, context)
  setter += setterRow(scroll, `overflow${scrollDirection}: ${scroll}`, contents)

  return resolveCssClass(identifier, contents, setter, context)
}

export const getResourceDisplay = (
  identifier: UnunuraIdentifier,
  contents: string[],
  context?: UnunuraContextualizeStack
): string => {
  const base = findResource(contents, [
    'block',
    'inline-block',
    'inline',
    'inline-flex',
    'flex',
    'table',
    'inline-table',
    'grid',
    'none',
    'contents',
    'list-item',
    'flow-root',
    'table-row',
    'table-cell',
  ])

  const inCss = resolveIdentifierInCSS(identifier)

  let setter = setterHead(contents, context)
  setter += setterRow(base, `${inCss}: ${base}`, contents)

  return resolveCssClass(identifier, contents, setter, context)
}

export const getResourceFloat = (
  identifier: UnunuraIdentifier,
  contents: string[],
  context?: UnunuraContextualizeStack
): string => {
  const base = findResource(contents, ['right', 'left', 'none'])

  const inCss = resolveIdentifierInCSS(identifier)

  let setter = setterHead(contents, context)
  setter += setterRow(base, `${inCss}: ${base}`, contents)

  return resolveCssClass(identifier, contents, setter, context)
}

export const getResourceZIndex = (
  identifier: UnunuraIdentifier,
  contents: string[],
  context?: UnunuraContextualizeStack
): string => {
  const value = getSupportedInteger(contents)

  const inCss = resolveIdentifierInCSS(identifier)

  let setter = setterHead(contents, context)
  setter += setterRow(value, `${inCss}: ${value}`, contents)

  return resolveCssClass(identifier, contents, setter, context)
}

export const getResourceReset = (
  identifier: UnunuraIdentifier,
  contents: string[],
  context?: UnunuraContextualizeStack
): string => {
  const novoutReset = contents.find((c) => c === 'novout')
  const meyerReset = contents.find((c) => c === 'meyer')

  const antialiased = contents.find((c) => c === 'antialiased')

  if (novoutReset) return NOVOUT_RESET_CSS()
  if (meyerReset) return MEYER_RESET_CSS()

  let setter = '* {\n'
  if (antialiased) setter += ANTIALIASED_RESET_CSS()
  setter += '}'

  return setter
}

export const getResourceShadow = (
  identifier: UnunuraIdentifier,
  contents: string[],
  context?: UnunuraContextualizeStack
): string => {
  const color = getSupportedColor(contents)
  const horizontal = findResourceInStart(contents, ['h-'], { onlyValue: true })
  const vertical = findResourceInStart(contents, ['v-'], { onlyValue: true })
  const blur = findResourceInStart(contents, ['blur-'], { onlyValue: true })
  const radius = findResourceInStart(contents, ['radius-'], { onlyValue: true })
  const inset = findResource(contents, ['inset'])

  const colorResolved = isNullable(color) ? 'rgba(0, 0, 0, 0.5)' : color
  const horizontalResolved = isNullable(horizontal) ? '5px' : horizontal + 'px'
  const verticalResolved = isNullable(vertical) ? '5px' : vertical + 'px'
  const blurResolved = isNullable(blur) ? '5px' : blur + 'px'
  const radiusResolved = isNullable(radius) ? '0px' : radius + 'px'

  const value = `${
    !isNullable(inset) ? `${inset} ` : ''
  }${horizontalResolved} ${verticalResolved} ${blurResolved} ${radiusResolved} ${colorResolved};\n`

  let setter = setterHead(contents, context)
  setter += `  box-shadow: ${value}`
  setter += `  -webkit-box-shadow: ${value}`
  setter += `  -moz-box-shadow: ${value}`

  return resolveCssClass(identifier, contents, setter, context)
}

export const getResourceCursor = (
  identifier: UnunuraIdentifier,
  contents: string[],
  context?: UnunuraContextualizeStack
): string => {
  const cursor = getSupportedCursor(contents)

  let setter = setterHead(contents, context)
  setter += setterRow(cursor, `cursor: ${cursor}`, contents)

  return resolveCssClass(identifier, contents, setter, context)
}

export const getResourceText = (
  identifier: UnunuraIdentifier,
  contents: string[],
  context?: UnunuraContextualizeStack
): string => {
  const color = getSupportedColor(contents)
  const fontSize = getSupportedNumber(contents)
  const fontFamily = getSupportedFont(contents)
  const fontWeight = getSupportedFontWeight(contents)

  let setter = setterHead(contents, context)
  setter += setterRow(color, `color: ${color}`, contents)
  setter += setterRow(fontSize, `font-size: ${fontSize}`, contents)
  setter += setterRow(fontWeight, `font-weight: ${fontWeight}`, contents)
  setter += setterRow(fontFamily, `font-family: '${fontFamily}', sans-serif`, contents)

  return resolveCssClass(identifier, contents, setter, context)
}

export const getResourceFlex = (
  identifier: UnunuraIdentifier,
  contents: string[],
  context?: UnunuraContextualizeStack
): string => {
  const direction = getSupportedFlexDirection(contents)
  const grow = getSupportedFlexGrow(contents)
  const wrap = getSupportedFlexWrap(contents)
  const flex = getSupportedStandardFlex(contents)
  const gap = getSupportedFlexGap(contents)
  const horizontal = getSupportedFlexHorizontal(contents).replace(/h-/, '')
  const vertical = getSupportedFlexVertical(contents).replace(/v-/, '')

  let setter = setterHead(contents, context, 'display: flex;')
  setter += setterRow(direction, `${identifier}-direction: ${direction}`, contents)
  setter += setterRow(grow, `${identifier}-grow: ${grow}`, contents)
  setter += setterRow(wrap, `${identifier}-wrap: ${wrap}`, contents)
  setter += setterRow(flex, `${identifier}: ${flex.split('-')[1]} ${flex.split('-')[1]} 0%`, contents)
  setter += setterRow(gap, `gap: ${gap.split('-')[1]}`, contents)
  setter += setterRow(horizontal, `justify-content: ${horizontal}`, contents)
  setter += setterRow(vertical, `align-items: ${vertical}`, contents)

  return resolveCssClass(identifier, contents, setter, context)
}
