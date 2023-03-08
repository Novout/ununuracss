import {
  UnunuraIdentifier,
  NULLABLE,
  isBorderStyle,
  isNullable,
  isSlashImage,
  UnunuraGenerateContext,
  isTransitionProperty,
  isTransitionTimingFunction,
  isTypographyOverflow,
  isTypographyTransform,
  isOutlineStyle,
  Maybe,
  UnunuraSetterCSSOptions,
} from 'ununura-shared'
import {
  getSupportedAlignContent,
  getSupportedAlignItems,
  getSupportedAlignSelf,
  getSupportedColor,
  getSupportedCursor,
  getSupportedDirection,
  getSupportedFlexDirection,
  getSupportedFlexGrow,
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
  getSupportedJustifyContent,
  getSupportedJustifyItems,
  getSupportedJustifySelf,
  getSupportedMinOrMax,
  getSupportedNumber,
  getSupportedResize,
  getSupportedScroll,
  getSupportedScrollDirection,
  getSupportedTouch,
} from './support'
import { resolveCSS, resolveCssClass, resolveIdentifierInCSS } from './resolvers'
import { validatePercentage, validateRGBA, validateSpreadAllResource } from './validate'
import { RawRGBAToCssRGB } from './transformers'
import { findResource, findResourceInStart } from './finders'

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

  const asContent = findResourceInStart(ctx.contents, ['content-'], { onlyValue: true })

  let preSetter = '\n' + (start && isNullable(asDef) ? `  ${start}\n` : '')

  preSetter += setterRow(asContent, `content: "${asContent.replace(/_/gi, ' ')}"`, ctx.contents)

  return preSetter
}

export const setterRow = (
  item: Maybe<string> = undefined,
  raw: string | string[],
  contents: string[],
  options?: UnunuraSetterCSSOptions
): string => {
  const asImportant = getSupportedGlobalImportant(contents)

  if (Array.isArray(raw)) {
    return raw.reduce((acc, current) => (acc += setterRow(item, current, contents)), '')
  }

  return !isNullable(item)
    ? `${options?.removeWhitespaceInStart ? raw : `  ${raw}`}${
        !isNullable(asImportant) && !options?.removeImportantCase ? ' !important' : ''
      }${options?.removeSemicolonAndBreakLineInEnd ? '' : ';\n'}`
    : ''
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
      (sum, acc) => (sum += ` ${getSupportedNumber({ contents: [acc], stack: [], buffer: [], ununura: ctx.ununura })}`),
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
    (sum, acc) => (sum += ` ${getSupportedNumber({ contents: [acc], stack: [], buffer: [], ununura: ctx.ununura })}`),
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

  const left = findResourceInStart(ctx.contents, ['left-', 'l-'], { onlyValue: true, supporter: getSupportedNumber })
  const right = findResourceInStart(ctx.contents, ['right-', 'r-'], { onlyValue: true, supporter: getSupportedNumber })
  const top = findResourceInStart(ctx.contents, ['top-', 't-'], { onlyValue: true, supporter: getSupportedNumber })
  const bottom = findResourceInStart(ctx.contents, ['bottom-', 'b-'], { onlyValue: true, supporter: getSupportedNumber })

  if (!base) return NULLABLE

  let setter = setterHead(ctx)
  setter += setterRow(base, `position: ${base}`, ctx.contents)
  setter += setterRow(left, `left: ${left}`, ctx.contents)
  setter += setterRow(right, `right: ${right}`, ctx.contents)
  setter += setterRow(top, `top: ${top}`, ctx.contents)
  setter += setterRow(bottom, `bottom: ${bottom}`, ctx.contents)

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
  const offset = findResourceInStart(ctx.contents, ['offset-'], { onlyValue: true, supporter: getSupportedNumber })

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
  const fillColor = findResourceInStart(ctx.contents, ['fill-'], { onlyValue: true, supporter: getSupportedColor })
  const strokeColor = findResourceInStart(ctx.contents, ['stroke-color-'], { onlyValue: true, supporter: getSupportedColor })
  const strokeWidth = findResourceInStart(ctx.contents, ['stroke-width-'], { onlyValue: true, supporter: getSupportedNumber })

  let setter = setterHead(ctx)
  setter += setterRow(color, `color: ${color}`, ctx.contents)
  if (fontSize !== fontWeight) setter += setterRow(fontSize, `font-size: ${fontSize}`, ctx.contents)
  setter += setterRow(fontWeight, `font-weight: ${fontWeight}`, ctx.contents)
  setter += setterRow(fontFamily, `font-family: '${fontFamily}', sans-serif`, ctx.contents)
  setter += setterRow(strokeWidth, `-webkit-text-stroke-width: ${strokeWidth}`, ctx.contents)
  setter += setterRow(strokeColor, `-webkit-text-stroke-color: ${strokeColor}`, ctx.contents)
  setter += setterRow(fillColor, `-webkit-text-fill-color: ${fillColor}`, ctx.contents)

  return resolveCssClass(identifier, setter, ctx)
}

export const getResourceFlex = (
  identifier: UnunuraIdentifier,

  ctx: UnunuraGenerateContext
): string => {
  const direction = getSupportedFlexDirection(ctx.contents)
  const grow = getSupportedFlexGrow(ctx.contents)
  const wrap = getSupportedFlexWrap(ctx.contents)
  const flex = findResourceInStart(ctx.contents, ['flex-'], { onlyValue: true })
  const gap = findResourceInStart(ctx.contents, ['gap-'], { onlyValue: true, supporter: getSupportedNumber })
  const justifyContent = findResourceInStart(ctx.contents, ['h-', 'jc-'], {
    onlyValue: true,
    supporter: getSupportedJustifyContent,
  })
  const justifyItems = findResourceInStart(ctx.contents, ['ji-'], {
    onlyValue: true,
    supporter: getSupportedJustifyItems,
  })
  const justifySelf = findResourceInStart(ctx.contents, ['js-'], {
    onlyValue: true,
    supporter: getSupportedJustifySelf,
  })
  const alignContent = findResourceInStart(ctx.contents, ['ac-'], { onlyValue: true, supporter: getSupportedAlignContent })
  const alignItems = findResourceInStart(ctx.contents, ['v-', 'ai-'], { onlyValue: true, supporter: getSupportedAlignItems })
  const alignSelf = findResourceInStart(ctx.contents, ['as-'], { onlyValue: true, supporter: getSupportedAlignSelf })
  const shrink = findResourceInStart(ctx.contents, ['shrink-'], { onlyValue: true })

  const inCss = resolveIdentifierInCSS(identifier)

  let setter = setterHead(ctx, 'display: flex;')
  setter += setterRow(direction, `${inCss}-direction: ${direction}`, ctx.contents)
  setter += setterRow(grow, `${inCss}-grow: ${grow}`, ctx.contents)
  setter += setterRow(wrap, `${inCss}-wrap: ${wrap}`, ctx.contents)
  setter += setterRow(flex, `${inCss}: ${flex} ${flex} 0%`, ctx.contents)
  setter += setterRow(gap, `gap: ${gap}`, ctx.contents)
  setter += setterRow(justifyContent, `justify-content: ${justifyContent}`, ctx.contents)
  setter += setterRow(justifyItems, `justify-items: ${justifyItems}`, ctx.contents)
  setter += setterRow(justifySelf, `justify-self: ${justifySelf}`, ctx.contents)
  setter += setterRow(alignContent, `align-content: ${alignContent}`, ctx.contents)
  setter += setterRow(alignItems, `align-items: ${alignItems}`, ctx.contents)
  setter += setterRow(alignSelf, `align-self: ${alignSelf}`, ctx.contents)
  setter += setterRow(shrink, `${inCss}-shrink: ${shrink}`, ctx.contents)

  return resolveCssClass(identifier, setter, ctx)
}

export const getResourceGrid = (
  identifier: UnunuraIdentifier,

  ctx: UnunuraGenerateContext
): string => {
  const cols = findResourceInStart(ctx.contents, ['cols-'], { onlyValue: true })
  const rows = findResourceInStart(ctx.contents, ['rows-'], { onlyValue: true })
  const colSpan = findResourceInStart(ctx.contents, ['c-span-', 'col-span-'], { onlyValue: true })
  const rowSpan = findResourceInStart(ctx.contents, ['r-span-', 'row-span-'], { onlyValue: true })
  const flow = findResourceInStart(ctx.contents, ['flow-'], { onlyValue: true })
  const autoFlow = findResourceInStart(ctx.contents, ['auto-flow-', 'a-flow-'], { onlyValue: true })
  const gap = findResourceInStart(ctx.contents, ['gap-'], { onlyValue: true, supporter: getSupportedNumber })
  const justifyContent = findResourceInStart(ctx.contents, ['h-', 'jc-'], {
    onlyValue: true,
    supporter: getSupportedJustifyContent,
  })
  const justifyItems = findResourceInStart(ctx.contents, ['ji-'], {
    onlyValue: true,
    supporter: getSupportedJustifyItems,
  })
  const justifySelf = findResourceInStart(ctx.contents, ['js-'], {
    onlyValue: true,
    supporter: getSupportedJustifySelf,
  })
  const alignContent = findResourceInStart(ctx.contents, ['ac-'], { onlyValue: true, supporter: getSupportedAlignContent })
  const alignItems = findResourceInStart(ctx.contents, ['v-', 'ai-'], { onlyValue: true, supporter: getSupportedAlignItems })
  const alignSelf = findResourceInStart(ctx.contents, ['as-'], { onlyValue: true, supporter: getSupportedAlignSelf })

  const inCss = resolveIdentifierInCSS(identifier)

  let setter = setterHead(ctx, `display: ${inCss};`)
  setter += setterRow(cols, `${inCss}-template-columns: repeat(${cols}, minmax(0, 1fr))`, ctx.contents)
  setter += setterRow(rows, `${inCss}-template-rows: repeat(${rows}, minmax(0, 1fr))`, ctx.contents)
  setter += setterRow(colSpan, `${inCss}-column: span ${colSpan} / span ${colSpan}`, ctx.contents)
  setter += setterRow(rowSpan, `${inCss}-row: span ${rowSpan} / span ${rowSpan}`, ctx.contents)
  // TODO: Find with >-< cases
  setter += setterRow(flow, `${inCss}-auto-flow: ${flow}`, ctx.contents)
  setter += setterRow(autoFlow, `${inCss}-auto-columns: ${autoFlow}`, ctx.contents)
  setter += setterRow(gap, `gap: ${gap}`, ctx.contents)
  setter += setterRow(justifyContent, `justify-content: ${justifyContent}`, ctx.contents)
  setter += setterRow(justifyItems, `justify-items: ${justifyItems}`, ctx.contents)
  setter += setterRow(justifySelf, `justify-self: ${justifySelf}`, ctx.contents)
  setter += setterRow(alignContent, `align-content: ${alignContent}`, ctx.contents)
  setter += setterRow(alignItems, `align-items: ${alignItems}`, ctx.contents)
  setter += setterRow(alignSelf, `align-self: ${alignSelf}`, ctx.contents)

  return resolveCssClass(identifier, setter, ctx)
}

export const getResourceTypography = (identifier: UnunuraIdentifier, ctx: UnunuraGenerateContext): string => {
  const indent = findResourceInStart(ctx.contents, ['indent-'], { onlyValue: true, supporter: getSupportedNumber })
  const letterSpacing = findResourceInStart(ctx.contents, ['letter-'], { onlyValue: true, supporter: getSupportedNumber })
  const wordSpacing = findResourceInStart(ctx.contents, ['word-'], { onlyValue: true, supporter: getSupportedNumber })
  const line = findResourceInStart(ctx.contents, ['line-', 'h-'], { onlyValue: true, supporter: getSupportedNumber })
  const decoration = findResourceInStart(ctx.contents, ['decoration-'], { onlyValue: true })
  const overflow = ctx.contents.find((c) => isTypographyOverflow(c))
  const transform = ctx.contents.find((c) => isTypographyTransform(c))
  const space = findResourceInStart(ctx.contents, ['space-'], { onlyValue: true })
  const _break = findResourceInStart(ctx.contents, ['break-'], { onlyValue: true })
  const align = findResource(ctx.contents, ['left', 'right', 'center', 'justify', 'initial', 'inherit'])

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
  const asImportant = getSupportedGlobalImportant(ctx.contents)

  const rotate = findResourceInStart(ctx.contents, ['rotate-'], { onlyValue: true })
  const rotateX = findResourceInStart(ctx.contents, ['rotateX-', 'rotate-x-'], { onlyValue: true })
  const rotateY = findResourceInStart(ctx.contents, ['rotateY-', 'rotate-y-'], { onlyValue: true })
  const rotateZ = findResourceInStart(ctx.contents, ['rotateZ-', 'rotate-z-'], { onlyValue: true })
  const translateX = findResourceInStart(ctx.contents, ['translateX-', 'translate-x-'], { onlyValue: true })
  const translateY = findResourceInStart(ctx.contents, ['translateY-', 'translate-y-'], { onlyValue: true })
  const translateZ = findResourceInStart(ctx.contents, ['translateZ-', 'translate-z-'], { onlyValue: true })
  const scaleX = findResourceInStart(ctx.contents, ['scaleX-', 'scale-x-'], { onlyValue: true })
  const scaleY = findResourceInStart(ctx.contents, ['scaleY-', 'scale-y-'], { onlyValue: true })
  const scaleZ = findResourceInStart(ctx.contents, ['scaleZ-', 'scale-z-'], { onlyValue: true })
  const skewX = findResourceInStart(ctx.contents, ['skewX-', 'skew-x-'], { onlyValue: true })
  const skewY = findResourceInStart(ctx.contents, ['skewY-', 'skew-y-'], { onlyValue: true })
  const perspective = findResourceInStart(ctx.contents, ['perspective-'], { onlyValue: true })

  const inCss = resolveIdentifierInCSS(identifier)

  let setter = setterHead(ctx)
  setter += `  ${inCss}: `
  setter += setterRow(rotate, `rotate(${rotate}) `, ctx.contents, {
    removeSemicolonAndBreakLineInEnd: true,
    removeImportantCase: true,
    removeWhitespaceInStart: true,
  })
  setter += setterRow(rotateX, `rotateX(${rotateX}) `, ctx.contents, {
    removeSemicolonAndBreakLineInEnd: true,
    removeImportantCase: true,
    removeWhitespaceInStart: true,
  })
  setter += setterRow(rotateY, `rotateY(${rotateY}) `, ctx.contents, {
    removeSemicolonAndBreakLineInEnd: true,
    removeImportantCase: true,
    removeWhitespaceInStart: true,
  })
  setter += setterRow(rotateZ, `rotateZ(${rotateZ}) `, ctx.contents, {
    removeSemicolonAndBreakLineInEnd: true,
    removeImportantCase: true,
    removeWhitespaceInStart: true,
  })
  setter += setterRow(translateX, `translateX(${translateX}) `, ctx.contents, {
    removeSemicolonAndBreakLineInEnd: true,
    removeImportantCase: true,
    removeWhitespaceInStart: true,
  })
  setter += setterRow(translateY, `translateY(${translateY}) `, ctx.contents, {
    removeSemicolonAndBreakLineInEnd: true,
    removeImportantCase: true,
    removeWhitespaceInStart: true,
  })
  setter += setterRow(translateZ, `translateZ(${translateZ}) `, ctx.contents, {
    removeSemicolonAndBreakLineInEnd: true,
    removeImportantCase: true,
    removeWhitespaceInStart: true,
  })
  setter += setterRow(scaleX, `scaleX(${scaleX}) `, ctx.contents, {
    removeSemicolonAndBreakLineInEnd: true,
    removeImportantCase: true,
    removeWhitespaceInStart: true,
  })
  setter += setterRow(scaleY, `scaleY(${scaleY}) `, ctx.contents, {
    removeSemicolonAndBreakLineInEnd: true,
    removeImportantCase: true,
    removeWhitespaceInStart: true,
  })
  setter += setterRow(scaleZ, `scaleZ(${scaleZ}) `, ctx.contents, {
    removeSemicolonAndBreakLineInEnd: true,
    removeImportantCase: true,
    removeWhitespaceInStart: true,
  })
  setter += setterRow(skewX, `skewX(${skewX}) `, ctx.contents, {
    removeSemicolonAndBreakLineInEnd: true,
    removeImportantCase: true,
    removeWhitespaceInStart: true,
  })
  setter += setterRow(skewY, `skewY(${skewY}) `, ctx.contents, {
    removeSemicolonAndBreakLineInEnd: true,
    removeImportantCase: true,
    removeWhitespaceInStart: true,
  })
  setter += setterRow(perspective, `perspective(${perspective}) `, ctx.contents, {
    removeSemicolonAndBreakLineInEnd: true,
    removeImportantCase: true,
    removeWhitespaceInStart: true,
  })
  setter = setter.trimEnd() + (!isNullable(asImportant) ? ' !important;\n' : ';\n')

  return resolveCssClass(identifier, setter, ctx)
}

export const getResourceFilter = (identifier: UnunuraIdentifier, ctx: UnunuraGenerateContext): string => {
  const asImportant = getSupportedGlobalImportant(ctx.contents)

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
  setter += setterRow(blur, `blur(${blur}) `, ctx.contents, {
    removeImportantCase: true,
    removeSemicolonAndBreakLineInEnd: true,
    removeWhitespaceInStart: true,
  })
  setter += setterRow(contrast, `contrast(${contrast}) `, ctx.contents, {
    removeImportantCase: true,
    removeSemicolonAndBreakLineInEnd: true,
    removeWhitespaceInStart: true,
  })
  setter += setterRow(grayscale, `grayscale(${grayscale}) `, ctx.contents, {
    removeImportantCase: true,
    removeSemicolonAndBreakLineInEnd: true,
    removeWhitespaceInStart: true,
  })
  setter += setterRow(hue, `hue-rotate(${hue}) `, ctx.contents, {
    removeImportantCase: true,
    removeSemicolonAndBreakLineInEnd: true,
    removeWhitespaceInStart: true,
  })
  setter += setterRow(invert, `invert(${invert}) `, ctx.contents, {
    removeImportantCase: true,
    removeSemicolonAndBreakLineInEnd: true,
    removeWhitespaceInStart: true,
  })
  setter += setterRow(saturate, `saturate(${saturate}) `, ctx.contents, {
    removeImportantCase: true,
    removeSemicolonAndBreakLineInEnd: true,
    removeWhitespaceInStart: true,
  })
  setter += setterRow(sepia, `sepia(${sepia}) `, ctx.contents, {
    removeImportantCase: true,
    removeSemicolonAndBreakLineInEnd: true,
    removeWhitespaceInStart: true,
  })
  setter = setter.trimEnd() + (!isNullable(asImportant) ? ' !important;\n' : ';\n')

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

export const getResourceGradient = (identifier: UnunuraIdentifier, ctx: UnunuraGenerateContext): string => {
  const [direction, ...colors] = ctx.contents

  let setter = setterHead(ctx)
  setter += setterRow(direction, `background: ${RawRGBAToCssRGB(colors[0])}`, ctx.contents)
  setter += colors.reduce((acc, value, index, arr) => {
    const isRGBA = validateRGBA(value)
    const isPercentage = validatePercentage(value)
    const isEndStage = index % 2 !== 0 && index + 1 !== arr.length

    if (isRGBA) return (acc += ` ${RawRGBAToCssRGB(value)}${isEndStage ? ',' : ''}`)

    if (isPercentage) return (acc += ` ${value}${isEndStage ? ',' : ''}`)

    return acc
  }, `  background: linear-gradient(${direction ?? '90deg'},`)
  setter = setter.trimEnd() + ');\n'

  return resolveCssClass(identifier, setter, ctx)
}

export const getResourceAnimation = (identifier: UnunuraIdentifier, ctx: UnunuraGenerateContext): string => {
  const name = findResourceInStart(ctx.contents, ['name-'], { onlyValue: true })
  const duration = findResourceInStart(ctx.contents, ['duration-'], { onlyValue: true })
  const delay = findResourceInStart(ctx.contents, ['delay-'], { onlyValue: true })
  const iteration = findResourceInStart(ctx.contents, ['iteration-'], { onlyValue: true })
  const direction = findResourceInStart(ctx.contents, ['direction-'], { onlyValue: true })
  const timing = findResourceInStart(ctx.contents, ['timing-'], { onlyValue: true })
  const fill = findResourceInStart(ctx.contents, ['fill-'], { onlyValue: true })

  const inCss = resolveIdentifierInCSS(identifier)

  let setter = setterHead(ctx)
  setter += setterRow(name, `${inCss}-name: ${name}`, ctx.contents)
  setter += setterRow(duration, `${inCss}-duration: ${duration}`, ctx.contents)
  setter += setterRow(delay, `${inCss}-delay: ${delay}`, ctx.contents)
  setter += setterRow(iteration, `${inCss}-iteration-count: ${iteration}`, ctx.contents)
  setter += setterRow(direction, `${inCss}-direction: ${direction}`, ctx.contents)
  setter += setterRow(timing, `${inCss}-timing-function: ${timing}`, ctx.contents)
  setter += setterRow(fill, `${inCss}-fill-mode: ${fill}`, ctx.contents)

  return resolveCssClass(identifier, setter, ctx)
}

export const getResourceCollection = (identifier: UnunuraIdentifier, ctx: UnunuraGenerateContext): string => {
  const truncate = findResource(ctx.contents, ['truncate'])
  const screen = findResource(ctx.contents, ['screen'])

  let setter = setterHead(ctx)
  setter += setterRow(truncate, ['overflow: hidden', 'text-overflow: ellipsis', 'white-space: nowrap'], ctx.contents)
  setter += setterRow(screen, ['min-height: 100vh', 'width: 100%', 'overflow-y: auto'], ctx.contents)

  return resolveCssClass(identifier, setter, ctx)
}
