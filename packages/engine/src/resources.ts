import {
  UnunuraIdentifier,
  NULLABLE,
  isBorderStyle,
  isNullable,
  Option,
  findResource,
  findResourceInStart,
  isSlashImage,
  UnunuraGenerateContext,
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

export const generateMultipleClass = ([identifier, content]: [string, string], ctx: UnunuraGenerateContext) => {
  const contents = content.split(' ')

  ctx.contents.push(...contents)

  return resolveCSS(identifier as UnunuraIdentifier, ctx)
}

export const generateUniqueClass = ([identifier, content]: [string, string], ctx: UnunuraGenerateContext) => {
  ctx.contents.push(content)

  return resolveCSS(identifier as UnunuraIdentifier, ctx)
}

export const setterHead = (ctx: UnunuraGenerateContext, start?: string) => {
  const asDef = getSupportedGlobalNone(ctx.contents)

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

export const getResourceSpreadValues = (identifier: UnunuraIdentifier, ctx: UnunuraGenerateContext): string => {
  const values = validateSpreadAllResource(ctx.contents)

  if (values.length === 0) return NULLABLE

  let setter = setterHead(ctx)

  const spread = `${resolveIdentifierInCSS(identifier)}:${values.reduce(
    (sum, acc) => (sum += ` ${getSupportedNumber([acc])}`),
    ''
  )}`

  setter += setterRow('' as any, spread, ctx.contents)

  return resolveCssClass(identifier, setter, ctx)
}

export const getResourceWidthOrHeight = (identifier: UnunuraIdentifier, ctx: UnunuraGenerateContext): string => {
  const size = getSupportedNumber(ctx.contents)
  const ranged = getSupportedMinOrMax(ctx.contents)

  const inCss = resolveIdentifierInCSS(identifier)

  let setter = setterHead(ctx)
  ranged
    ? (setter +=
        !isNullable(ranged) && !isNullable(size)
          ? setterRow('' as any, `${ranged}-${inCss}: ${size}`, ctx.contents)
          : !isNullable(size)
          ? setterRow('' as any, `${inCss}: ${size}`, ctx.contents)
          : '')
    : ''

  return resolveCssClass(identifier, setter, ctx)
}

export const getResourcePosition = (
  identifier: UnunuraIdentifier,

  ctx: UnunuraGenerateContext
): string => {
  const base = findResource(ctx.contents, ['static', 'relative', 'fixed', 'absolute', 'sticky'])

  const left = findResourceInStart(ctx.contents, ['left-'])
  const right = findResourceInStart(ctx.contents, ['right-'])
  const top = findResourceInStart(ctx.contents, ['top-'])
  const bottom = findResourceInStart(ctx.contents, ['bottom-'])

  if (!base) return NULLABLE

  let setter = setterHead(ctx)
  setter += setterRow(base, `position: ${base}`, ctx.contents)
  setter += setterRow(left, `left: ${left.split('-')[1]}`, ctx.contents)
  setter += setterRow(right, `right: ${right.split('-')[1]}`, ctx.contents)
  setter += setterRow(top, `top: ${top.split('-')[1]}`, ctx.contents)
  setter += setterRow(bottom, `bottom: ${bottom.split('-')[1]}`, ctx.contents)

  return resolveCssClass(identifier, setter, ctx)
}

export const getResourceBorder = (
  identifier: UnunuraIdentifier,

  ctx: UnunuraGenerateContext
): string => {
  const size = getSupportedNumber(ctx.contents)
  const style = ctx.contents.find((c) => isBorderStyle(c)) ?? NULLABLE
  const color = getSupportedColor(ctx.contents)

  const inCss = resolveIdentifierInCSS(identifier)

  let setter = setterHead(ctx)
  setter += setterRow(style, `${inCss}: ${style}`, ctx.contents)
  setter += setterRow(color, `${inCss}-color: ${color}`, ctx.contents)
  setter += setterRow(size, `${inCss}-width: ${size}`, ctx.contents)

  return resolveCssClass(identifier, setter, ctx)
}

export const getResourceBackground = (
  identifier: UnunuraIdentifier,

  ctx: UnunuraGenerateContext
): string => {
  const color = getSupportedColor(ctx.contents)
  const image = getSupportedImage(ctx.contents)
  const size = getSupportedImageSize(ctx.contents)
  const repeat = getSupportedImageRepeat(ctx.contents)

  const inCss = resolveIdentifierInCSS(identifier)

  let setter = setterHead(ctx)
  setter += setterRow(color, `${inCss}-color: ${color}`, ctx.contents)
  setter += setterRow(image, `${inCss}-image: url("${isSlashImage(image) ? 'https:' : ''}${image}")`, ctx.contents)
  setter += setterRow(size, `${inCss}-size: ${size}`, ctx.contents)
  setter += setterRow(repeat, `${inCss}-repeat: ${repeat}`, ctx.contents)

  return resolveCssClass(identifier, setter, ctx)
}

export const getResourceScroll = (
  identifier: UnunuraIdentifier,

  ctx: UnunuraGenerateContext
): string => {
  const scroll = getSupportedScroll(ctx.contents)
  const scrollDirection = getSupportedScrollDirection(ctx.contents)

  let setter = setterHead(ctx)
  setter += setterRow(scroll, `overflow${scrollDirection}: ${scroll}`, ctx.contents)

  return resolveCssClass(identifier, setter, ctx)
}

export const getResourceDisplay = (
  identifier: UnunuraIdentifier,

  ctx: UnunuraGenerateContext
): string => {
  const base = findResource(ctx.contents, [
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

  let setter = setterHead(ctx)
  setter += setterRow(base, `${inCss}: ${base}`, ctx.contents)

  return resolveCssClass(identifier, setter, ctx)
}

export const getResourceFloat = (
  identifier: UnunuraIdentifier,

  ctx: UnunuraGenerateContext
): string => {
  const base = findResource(ctx.contents, ['right', 'left', 'none'])

  const inCss = resolveIdentifierInCSS(identifier)

  let setter = setterHead(ctx)
  setter += setterRow(base, `${inCss}: ${base}`, ctx.contents)

  return resolveCssClass(identifier, setter, ctx)
}

export const getResourceZIndex = (
  identifier: UnunuraIdentifier,

  ctx: UnunuraGenerateContext
): string => {
  const value = getSupportedInteger(ctx.contents)

  const inCss = resolveIdentifierInCSS(identifier)

  let setter = setterHead(ctx)
  setter += setterRow(value, `${inCss}: ${value}`, ctx.contents)

  return resolveCssClass(identifier, setter, ctx)
}

export const getResourceShadow = (
  identifier: UnunuraIdentifier,

  ctx: UnunuraGenerateContext
): string => {
  const color = getSupportedColor(ctx.contents)
  const horizontal = findResourceInStart(ctx.contents, ['h-'], { onlyValue: true })
  const vertical = findResourceInStart(ctx.contents, ['v-'], { onlyValue: true })
  const blur = findResourceInStart(ctx.contents, ['blur-'], { onlyValue: true })
  const radius = findResourceInStart(ctx.contents, ['radius-'], { onlyValue: true })
  const inset = findResource(ctx.contents, ['inset'])

  const colorResolved = isNullable(color) ? 'rgba(0, 0, 0, 0.5)' : color
  const horizontalResolved = isNullable(horizontal) ? '5px' : horizontal + 'px'
  const verticalResolved = isNullable(vertical) ? '5px' : vertical + 'px'
  const blurResolved = isNullable(blur) ? '5px' : blur + 'px'
  const radiusResolved = isNullable(radius) ? '0px' : radius + 'px'

  const value = `${
    !isNullable(inset) ? `${inset} ` : ''
  }${horizontalResolved} ${verticalResolved} ${blurResolved} ${radiusResolved} ${colorResolved};\n`

  let setter = setterHead(ctx)
  setter += `  box-shadow: ${value}`
  setter += `  -webkit-box-shadow: ${value}`
  setter += `  -moz-box-shadow: ${value}`

  return resolveCssClass(identifier, setter, ctx)
}

export const getResourceCursor = (
  identifier: UnunuraIdentifier,

  ctx: UnunuraGenerateContext
): string => {
  const cursor = getSupportedCursor(ctx.contents)

  let setter = setterHead(ctx)
  setter += setterRow(cursor, `cursor: ${cursor}`, ctx.contents)

  return resolveCssClass(identifier, setter, ctx)
}

export const getResourceText = (
  identifier: UnunuraIdentifier,

  ctx: UnunuraGenerateContext
): string => {
  const color = getSupportedColor(ctx.contents)
  const fontSize = getSupportedNumber(ctx.contents)
  const fontFamily = getSupportedFont(ctx.contents)
  const fontWeight = getSupportedFontWeight(ctx.contents)

  let setter = setterHead(ctx)
  setter += setterRow(color, `color: ${color}`, ctx.contents)
  setter += setterRow(fontSize, `font-size: ${fontSize}`, ctx.contents)
  setter += setterRow(fontWeight, `font-weight: ${fontWeight}`, ctx.contents)
  setter += setterRow(fontFamily, `font-family: '${fontFamily}', sans-serif`, ctx.contents)

  return resolveCssClass(identifier, setter, ctx)
}

export const getResourceFlex = (
  identifier: UnunuraIdentifier,

  ctx: UnunuraGenerateContext
): string => {
  const direction = getSupportedFlexDirection(ctx.contents)
  const grow = getSupportedFlexGrow(ctx.contents)
  const wrap = getSupportedFlexWrap(ctx.contents)
  const flex = getSupportedStandardFlex(ctx.contents)
  const gap = getSupportedFlexGap(ctx.contents)
  const horizontal = getSupportedFlexHorizontal(ctx.contents).replace(/h-/, '')
  const vertical = getSupportedFlexVertical(ctx.contents).replace(/v-/, '')

  let setter = setterHead(ctx, 'display: flex;')
  setter += setterRow(direction, `${identifier}-direction: ${direction}`, ctx.contents)
  setter += setterRow(grow, `${identifier}-grow: ${grow}`, ctx.contents)
  setter += setterRow(wrap, `${identifier}-wrap: ${wrap}`, ctx.contents)
  setter += setterRow(flex, `${identifier}: ${flex.split('-')[1]} ${flex.split('-')[1]} 0%`, ctx.contents)
  setter += setterRow(gap, `gap: ${gap.split('-')[1]}`, ctx.contents)
  setter += setterRow(horizontal, `justify-content: ${horizontal}`, ctx.contents)
  setter += setterRow(vertical, `align-items: ${vertical}`, ctx.contents)

  return resolveCssClass(identifier, setter, ctx)
}
