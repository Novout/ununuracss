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
  isTransitionProperty,
  isTransitionTimingFunction,
  isTypographyOverflow,
  isTypographyTransform,
  isOutlineStyle,
} from 'ununura-shared'
import {
  getSupportedColor,
  getSupportedCursor,
  getSupportedDirection,
  getSupportedFlexDirection,
  getSupportedFlexGap,
  getSupportedFlexGrow,
  getSupportedFlexHorizontal,
  getSupportedFlexVertical,
  getSupportedFlexWrap,
  getSupportedFont,
  getSupportedFontSize,
  getSupportedFontWeight,
  getSupportedGlobalImportant,
  getSupportedGlobalNone,
  getSupportedImage,
  getSupportedImageRepeat,
  getSupportedImageSize,
  getSupportedInteger,
  getSupportedMinOrMax,
  getSupportedNumber,
  getSupportedResize,
  getSupportedScroll,
  getSupportedScrollDirection,
  getSupportedStandardFlex,
  getSupportedTouch,
} from './support'
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

export const getResourcePaddingOrMargin = (identifier: UnunuraIdentifier, ctx: UnunuraGenerateContext): string => {
  const values = validateSpreadAllResource(ctx.contents)

  const direction = getSupportedDirection(ctx.contents)
  const size = getSupportedNumber(ctx)

  const inCss = resolveIdentifierInCSS(identifier)

  let setter = setterHead(ctx)

  if (!isNullable(direction) && !isNullable(size)) {
    setter += setterRow(direction, `${inCss}-${direction}: ${size}`, ctx.contents)
  } else {
    if (values.length === 0) return NULLABLE

    const spread = `${inCss}:${values.reduce(
      (sum, acc) => (sum += ` ${getSupportedNumber({ contents: [acc], stack: [], buffer: [] })}`),
      ''
    )}`

    setter += setterRow('' as any, spread, ctx.contents)
  }

  return resolveCssClass(identifier, setter, ctx)
}

export const getResourceRounded = (identifier: UnunuraIdentifier, ctx: UnunuraGenerateContext): string => {
  const values = validateSpreadAllResource(ctx.contents)

  if (values.length === 0) return NULLABLE

  let setter = setterHead(ctx)

  const spread = `${resolveIdentifierInCSS(identifier)}:${values.reduce(
    (sum, acc) => (sum += ` ${getSupportedNumber({ contents: [acc], stack: [], buffer: [] })}`),
    ''
  )}`

  setter += setterRow('' as any, spread, ctx.contents)

  return resolveCssClass(identifier, setter, ctx)
}

export const getResourceWidthOrHeight = (identifier: UnunuraIdentifier, ctx: UnunuraGenerateContext): string => {
  const size = getSupportedNumber(ctx)
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

  const left = findResourceInStart(ctx.contents, ['left-', 'l-'])
  const right = findResourceInStart(ctx.contents, ['right-', 'r-'])
  const top = findResourceInStart(ctx.contents, ['top-', 't-'])
  const bottom = findResourceInStart(ctx.contents, ['bottom-', 'b-'])

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
  const direction = getSupportedDirection(ctx.contents)
  const size = getSupportedNumber(ctx)
  const style = ctx.contents.find((c) => isBorderStyle(c)) ?? NULLABLE
  const color = getSupportedColor(ctx)

  const inCss = resolveIdentifierInCSS(identifier)

  let setter = setterHead(ctx)
  setter += setterRow(style, `${inCss}${!isNullable(direction) ? `-${direction}` : ''}: ${style}`, ctx.contents)
  setter += setterRow(color, `${inCss}${!isNullable(direction) ? `-${direction}` : ''}-color: ${color}`, ctx.contents)
  setter += setterRow(size, `${inCss}-${!isNullable(direction) ? `${direction}-` : ''}width: ${size}`, ctx.contents)

  return resolveCssClass(identifier, setter, ctx)
}

export const getResourceOutline = (
  identifier: UnunuraIdentifier,

  ctx: UnunuraGenerateContext
): string => {
  const size = getSupportedNumber(ctx)
  const style = ctx.contents.find((c) => isOutlineStyle(c)) ?? NULLABLE
  const color = getSupportedColor(ctx)
  const offset = findResourceInStart(ctx.contents, ['offset-'], { onlyValue: true })

  const inCss = resolveIdentifierInCSS(identifier)

  let setter = setterHead(ctx)
  setter += setterRow(style, `${inCss}: ${style}`, ctx.contents)
  setter += setterRow(color, `${inCss}-color: ${color}`, ctx.contents)
  setter += setterRow(size, `${inCss}-width: ${size}`, ctx.contents)
  setter += setterRow(offset, `${inCss}-offset: ${offset}`, ctx.contents)

  return resolveCssClass(identifier, setter, ctx)
}

export const getResourceBackground = (
  identifier: UnunuraIdentifier,

  ctx: UnunuraGenerateContext
): string => {
  const color = getSupportedColor(ctx)
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
  const color = getSupportedColor(ctx)
  const horizontal = findResourceInStart(ctx.contents, ['h-'], { onlyValue: true })
  const vertical = findResourceInStart(ctx.contents, ['v-'], { onlyValue: true })
  const blur = findResourceInStart(ctx.contents, ['blur-'], { onlyValue: true })
  const radius = findResourceInStart(ctx.contents, ['radius-'], { onlyValue: true })
  const none = findResource(ctx.contents, ['none'])
  const inset = findResource(ctx.contents, ['inset'])

  const isTextCase = ctx.contents.find((c) => c === 'text')

  let setter = setterHead(ctx)
  if (isTextCase) {
    const colorResolved = isNullable(color) ? 'black' : color
    const horizontalResolved = isNullable(horizontal) ? '' : horizontal + 'px '
    const verticalResolved = isNullable(vertical) ? '' : vertical + 'px '
    const blurResolved = isNullable(blur) ? '' : blur + 'px '

    const value = `${horizontalResolved}${verticalResolved}${blurResolved}${colorResolved};\n`

    setter += `  text-shadow: ${!isNullable(none) ? 'none;\n' : value}`
  } else {
    const colorResolved = isNullable(color) ? 'rgba(0, 0, 0, 0.5)' : color
    const horizontalResolved = isNullable(horizontal) ? '5px' : horizontal + 'px'
    const verticalResolved = isNullable(vertical) ? '5px' : vertical + 'px'
    const blurResolved = isNullable(blur) ? '5px' : blur + 'px'
    const radiusResolved = isNullable(radius) ? '0px' : radius + 'px'

    const value = `${
      !isNullable(inset) ? `${inset} ` : ''
    }${horizontalResolved} ${verticalResolved} ${blurResolved} ${radiusResolved} ${colorResolved};\n`

    setter += `  box-shadow: ${!isNullable(none) ? 'none;\n' : value}`
  }

  return resolveCssClass(identifier, setter, ctx)
}

export const getResourceText = (
  identifier: UnunuraIdentifier,

  ctx: UnunuraGenerateContext
): string => {
  const color = getSupportedColor(ctx)
  const fontSize = getSupportedFontSize(ctx)
  const fontFamily = getSupportedFont(ctx)
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
  const shrink = findResourceInStart(ctx.contents, ['shrink-'], { onlyValue: true })

  const inCss = resolveIdentifierInCSS(identifier)

  let setter = setterHead(ctx, 'display: flex;')
  setter += setterRow(direction, `${inCss}-direction: ${direction}`, ctx.contents)
  setter += setterRow(grow, `${inCss}-grow: ${grow}`, ctx.contents)
  setter += setterRow(wrap, `${inCss}-wrap: ${wrap}`, ctx.contents)
  setter += setterRow(flex, `${inCss}: ${flex.split('-')[1]} ${flex.split('-')[1]} 0%`, ctx.contents)
  setter += setterRow(gap, `gap: ${gap.split('-')[1]}`, ctx.contents)
  setter += setterRow(horizontal, `justify-content: ${horizontal}`, ctx.contents)
  setter += setterRow(vertical, `align-items: ${vertical}`, ctx.contents)
  setter += setterRow(shrink, `${inCss}-shrink: ${shrink}`, ctx.contents)

  return resolveCssClass(identifier, setter, ctx)
}

export const getResourceGrid = (
  identifier: UnunuraIdentifier,

  ctx: UnunuraGenerateContext
): string => {
  const cols = findResourceInStart(ctx.contents, ['cols-'], { onlyValue: true })
  const rows = findResourceInStart(ctx.contents, ['rows-'], { onlyValue: true })
  const colSpan = findResourceInStart(ctx.contents, ['Cspan-'], { onlyValue: true })
  const rowSpan = findResourceInStart(ctx.contents, ['Wspan-'], { onlyValue: true })
  const flow = findResourceInStart(ctx.contents, ['flow-'], { onlyValue: true })
  const autoFlow = findResourceInStart(ctx.contents, ['Aflow-'], { onlyValue: true })
  const gap = getSupportedFlexGap(ctx.contents)
  const horizontal = getSupportedFlexHorizontal(ctx.contents).replace(/h-/, '')
  const vertical = getSupportedFlexVertical(ctx.contents).replace(/v-/, '')

  const inCss = resolveIdentifierInCSS(identifier)

  let setter = setterHead(ctx, `display: ${inCss};`)
  setter += setterRow(cols, `${inCss}-template-columns: repeat(${cols}, minmax(0, 1fr))`, ctx.contents)
  setter += setterRow(rows, `${inCss}-template-rows: repeat(${rows}, minmax(0, 1fr))`, ctx.contents)
  setter += setterRow(colSpan, `${inCss}-column: span ${colSpan} / span ${colSpan}`, ctx.contents)
  setter += setterRow(rowSpan, `${inCss}-row: span ${rowSpan} / span ${rowSpan}`, ctx.contents)
  // TODO: Find with >-< cases
  setter += setterRow(flow, `${inCss}-auto-flow: ${flow}`, ctx.contents)
  setter += setterRow(autoFlow, `${inCss}-auto-columns: ${autoFlow}`, ctx.contents)
  setter += setterRow(gap, `gap: ${gap.split('-')[1]}`, ctx.contents)
  setter += setterRow(horizontal, `justify-content: ${horizontal}`, ctx.contents)
  setter += setterRow(vertical, `align-items: ${vertical}`, ctx.contents)

  return resolveCssClass(identifier, setter, ctx)
}

export const getResourceTypography = (identifier: UnunuraIdentifier, ctx: UnunuraGenerateContext): string => {
  const indent = findResourceInStart(ctx.contents, ['indent-'], { onlyValue: true })

  const letterSpacing = findResourceInStart(ctx.contents, ['lspacing-'], { onlyValue: true })
  const wordSpacing = findResourceInStart(ctx.contents, ['wspacing-'], { onlyValue: true })
  const line = findResourceInStart(ctx.contents, ['line-'], { onlyValue: true })
  const decoration = findResourceInStart(ctx.contents, ['decoration-'], { onlyValue: true })
  const overflow = ctx.contents.find((c) => isTypographyOverflow(c))
  const transform = ctx.contents.find((c) => isTypographyTransform(c))
  const space = findResourceInStart(ctx.contents, ['space-'], { onlyValue: true })
  const _break = findResourceInStart(ctx.contents, ['break-'], { onlyValue: true })
  const align = findResource(ctx.contents, ['left', 'right', 'center', 'justify', 'initial', 'inherit'])
  const truncate = findResource(ctx.contents, ['truncate'])

  const inCss = resolveIdentifierInCSS(identifier)

  let setter = setterHead(ctx)
  setter += setterRow(indent, `${inCss}-indent: ${indent}`, ctx.contents)
  setter += setterRow(letterSpacing, `letter-spacing: ${letterSpacing}`, ctx.contents)
  setter += setterRow(wordSpacing, `word-spacing: ${wordSpacing}`, ctx.contents)
  setter += setterRow(line, `line-height: ${line}`, ctx.contents)
  setter += setterRow(decoration, `${inCss}-decoration: ${decoration}`, ctx.contents)
  setter += setterRow(overflow, `${inCss}-overflow: ${overflow}`, ctx.contents)
  setter += setterRow(transform, `${inCss}-transform: ${transform}`, ctx.contents)
  setter += setterRow(space, `white-space: ${space}`, ctx.contents)
  setter += setterRow(_break, `word-break: ${_break}`, ctx.contents)
  setter += setterRow(align, `text-align: ${align}`, ctx.contents)
  setter += setterRow(truncate, `overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap`, ctx.contents)

  return resolveCssClass(identifier, setter, ctx)
}

export const getResourceTransition = (identifier: UnunuraIdentifier, ctx: UnunuraGenerateContext): string => {
  const delay = findResourceInStart(ctx.contents, ['delay-'], { onlyValue: true, validate: 'timer' })
  const transition = findResourceInStart(ctx.contents, ['duration-'], { onlyValue: true, validate: 'timer' })
  const property = ctx.contents.find((c) => isTransitionProperty(c))
  const timing = ctx.contents.find((c) => isTransitionTimingFunction(c))

  const inCss = resolveIdentifierInCSS(identifier)

  let setter = setterHead(ctx)
  setter += setterRow(delay, `${inCss}-delay: ${delay}`, ctx.contents)
  setter += setterRow(transition, `${inCss}-duration: ${transition}`, ctx.contents)
  setter += setterRow(property, `${inCss}-property: ${property}`, ctx.contents)
  setter += setterRow(timing, `${inCss}-timing-function: ${timing}`, ctx.contents)

  return resolveCssClass(identifier, setter, ctx)
}

export const getResourceTransform = (identifier: UnunuraIdentifier, ctx: UnunuraGenerateContext): string => {
  const rotate = findResourceInStart(ctx.contents, ['rotate-'], { onlyValue: true })
  const rotateX = findResourceInStart(ctx.contents, ['rotateX-'], { onlyValue: true })
  const rotateY = findResourceInStart(ctx.contents, ['rotateY-'], { onlyValue: true })
  const rotateZ = findResourceInStart(ctx.contents, ['rotateZ-'], { onlyValue: true })
  const translateX = findResourceInStart(ctx.contents, ['translateX-'], { onlyValue: true })
  const translateY = findResourceInStart(ctx.contents, ['translateY-'], { onlyValue: true })
  const translateZ = findResourceInStart(ctx.contents, ['translateZ-'], { onlyValue: true })
  const scaleX = findResourceInStart(ctx.contents, ['scaleX-'], { onlyValue: true })
  const scaleY = findResourceInStart(ctx.contents, ['scaleY-'], { onlyValue: true })
  const scaleZ = findResourceInStart(ctx.contents, ['scaleZ-'], { onlyValue: true })
  const skewX = findResourceInStart(ctx.contents, ['skewX-'], { onlyValue: true })
  const skewY = findResourceInStart(ctx.contents, ['skewY-'], { onlyValue: true })
  const perspective = findResourceInStart(ctx.contents, ['perspective-'], { onlyValue: true })

  const inCss = resolveIdentifierInCSS(identifier)

  let setter = setterHead(ctx)
  setter += `  ${inCss}: `
  setter += !isNullable(rotate) ? `rotate(${rotate}) ` : ''
  setter += !isNullable(rotateX) ? `rotateX(${rotateX}) ` : ''
  setter += !isNullable(rotateY) ? `rotateY(${rotateY}) ` : ''
  setter += !isNullable(rotateZ) ? `rotateZ(${rotateZ}) ` : ''
  setter += !isNullable(translateX) ? `translateX(${translateX}) ` : ''
  setter += !isNullable(translateY) ? `translateY(${translateY}) ` : ''
  setter += !isNullable(translateZ) ? `translateZ(${translateZ}) ` : ''
  setter += !isNullable(scaleX) ? `scaleX(${scaleX}) ` : ''
  setter += !isNullable(scaleY) ? `scaleY(${scaleY}) ` : ''
  setter += !isNullable(scaleZ) ? `scaleZ(${scaleZ}) ` : ''
  setter += !isNullable(skewX) ? `skewX(${skewX}) ` : ''
  setter += !isNullable(skewY) ? `skewY(${skewY}) ` : ''
  setter += !isNullable(perspective) ? `perspective(${perspective}) ` : ''
  setter = setter.trimEnd() + ';\n'

  return resolveCssClass(identifier, setter, ctx)
}

export const getResourceFilter = (identifier: UnunuraIdentifier, ctx: UnunuraGenerateContext): string => {
  const backdrop = findResource(ctx.contents, ['backdrop'])
  const blur = findResourceInStart(ctx.contents, ['blur-'], { onlyValue: true })
  const contrast = findResourceInStart(ctx.contents, ['contrast-'], { onlyValue: true })
  const grayscale = findResourceInStart(ctx.contents, ['grayscale-'], { onlyValue: true })
  const hue = findResourceInStart(ctx.contents, ['hue-'], { onlyValue: true })
  const invert = findResourceInStart(ctx.contents, ['invert-'], { onlyValue: true })
  const saturate = findResourceInStart(ctx.contents, ['saturate-'], { onlyValue: true })
  const sepia = findResourceInStart(ctx.contents, ['sepia-'], { onlyValue: true })

  const inCss = resolveIdentifierInCSS(identifier)

  let setter = setterHead(ctx)
  setter += !isNullable(backdrop) ? `  backdrop-${inCss}: ` : `  ${inCss}: `
  setter += !isNullable(blur) ? `blur(${blur}) ` : ''
  setter += !isNullable(contrast) ? `contrast(${contrast}) ` : ''
  setter += !isNullable(grayscale) ? `grayscale(${grayscale}) ` : ''
  setter += !isNullable(hue) ? `hue-rotate(${hue}) ` : ''
  setter += !isNullable(invert) ? `invert(${invert}) ` : ''
  setter += !isNullable(saturate) ? `saturate(${saturate}) ` : ''
  setter += !isNullable(sepia) ? `sepia(${sepia}) ` : ''
  setter = setter.trimEnd() + ';\n'

  return resolveCssClass(identifier, setter, ctx)
}

export const getResourceStyle = (identifier: UnunuraIdentifier, ctx: UnunuraGenerateContext): string => {
  const accent = findResourceInStart(ctx.contents, ['accent-'], { onlyValue: true, supporter: getSupportedColor })
  const appearance = findResource(ctx.contents, ['appearance', 'appearance-none'])
  const events = findResourceInStart(ctx.contents, ['events-'], { onlyValue: true })
  const resize = getSupportedResize(ctx.contents)
  const cursor = findResourceInStart(ctx.contents, ['cursor-'], { onlyValue: true, supporter: getSupportedCursor })
  const touch = findResourceInStart(ctx.contents, ['touch-'], { onlyValue: true, supporter: getSupportedTouch })
  const scroll = findResourceInStart(ctx.contents, ['scroll-'], { onlyValue: true })
  const select = findResourceInStart(ctx.contents, ['select-'], { onlyValue: true })

  let setter = setterHead(ctx)
  setter += setterRow(accent, `accent-color: ${accent}`, ctx.contents)
  setter += setterRow(appearance, `appearance: none`, ctx.contents)
  setter += setterRow(cursor, `cursor: ${cursor}`, ctx.contents)
  setter += setterRow(touch, `touch-action: ${touch}`, ctx.contents)
  setter += setterRow(events, `pointer-events: ${events}`, ctx.contents)
  setter += setterRow(resize, `resize: ${resize}`, ctx.contents)
  setter += setterRow(scroll, `scroll-behavior: ${scroll}`, ctx.contents)
  setter += setterRow(select, `user-select: ${select}`, ctx.contents)

  return resolveCssClass(identifier, setter, ctx)
}
