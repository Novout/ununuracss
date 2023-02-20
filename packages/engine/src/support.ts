import {
  findResource,
  findResourceInStart,
  isCSSColor,
  isCursor,
  isDefaultFont,
  isFlexHorizontal,
  isFlexVertical,
  isHex,
  isImage,
  isImageRepeat,
  isImageSize,
  isJustifyAlign,
  isJustifySelf,
  isNullable,
  isNumber,
  isNumberSuffix,
  isScroll,
  isSlashImage,
  isTouch,
  Nullable,
  NULLABLE,
  UnunuraGenerateContext,
} from 'ununura-shared'
import {
  getExistentDefaultUnit,
  getExtendedSupporterColor,
  getExtendedSupporterFontFamily,
  getExtendedSupporterUnits,
} from './externals'

export const getSupportedMinOrMax = (contents: string[]): Nullable<string> => {
  const min = contents.find((c) => c === 'min')
  const max = contents.find((c) => c === 'max')

  return min ?? max ?? NULLABLE
}

export const getSupportedColor = (ctx: UnunuraGenerateContext): Nullable<string> => {
  const ExternalColor = getExtendedSupporterColor(ctx)

  const HEXColor = ctx.contents.find((c) => isHex(c))
  const CSSColor = ctx.contents.find((c) => isCSSColor(c))

  const RGBColor = findResourceInStart(ctx.contents, ['rgb-'], { onlySpreadValue: true })
  const RGBAColor = findResourceInStart(ctx.contents, ['rgba-'], { onlySpreadValue: true })
  const HSLColor = findResourceInStart(ctx.contents, ['hsl-'], { onlySpreadValue: true })
  const HSLAColor = findResourceInStart(ctx.contents, ['hsla-'], { onlySpreadValue: true })

  const RGBColorResolved = !isNullable(RGBColor)
    ? `rgb(${RGBColor.split('-')
        .reduce((acc, val) => (acc += `${val}, `), '')
        .slice(0, -2)})`
    : undefined
  const RGBAColorResolved = !isNullable(RGBAColor)
    ? `rgba(${RGBAColor.split('-')
        .reduce((acc, val) => (acc += `${val}, `), '')
        .slice(0, -2)})`
    : undefined
  const HSLColorResolved = !isNullable(HSLColor)
    ? `hsl(${HSLColor.split('-')
        .reduce((acc, val) => (acc += `${val}, `), '')
        .slice(0, -2)})`
    : undefined
  const HSLAColorResolved = !isNullable(HSLAColor)
    ? `hsla(${HSLAColor.split('-')
        .reduce((acc, val) => (acc += `${val}, `), '')
        .slice(0, -2)})`
    : undefined

  const CSSVar = findResourceInStart(ctx.contents, ['--'])
  const CSSVarColorResolved = !isNullable(CSSVar) ? `var(${CSSVar})` : undefined

  const TransparentColor = ctx.contents.find((c) => c === 'transparent')
  const CurrentColor = ctx.contents.find((c) => c === 'currentColor')

  return (
    ExternalColor ??
    HEXColor ??
    CSSColor ??
    RGBColorResolved ??
    RGBAColorResolved ??
    HSLColorResolved ??
    HSLAColorResolved ??
    CSSVarColorResolved ??
    TransparentColor ??
    CurrentColor ??
    NULLABLE
  )
}

export const getSupportedDirection = (contents: string[]) => {
  const direction = findResource(contents, ['t', 'top', 'left', 'l', 'right', 'r', 'bottom', 'b'])

  return (
    {
      t: 'top',
      l: 'left',
      b: 'bottom',
      r: 'right',
    }[direction] || direction
  )
}

export const getSupportedImage = (contents: string[]): Nullable<string> => {
  const SlashImage = contents.find((c) => isSlashImage(c))
  const GenericImage = contents.find((c) => isImage(c))

  return SlashImage ?? GenericImage ?? NULLABLE
}

export const getSupportedImageSize = (contents: string[]): Nullable<string> => {
  return contents.find((c) => isImageSize(c)) ?? NULLABLE
}

export const getSupportedImageRepeat = (contents: string[]): Nullable<string> => {
  return contents.find((c) => isImageRepeat(c)) ?? NULLABLE
}

export const getSupportedFont = (ctx: UnunuraGenerateContext): Nullable<string> => {
  const ExternalFont = getExtendedSupporterFontFamily(ctx)

  const GenericFont = ctx.contents.find((c) => isDefaultFont(c))
  const GenericFontResolved = GenericFont ? GenericFont?.charAt(0).toUpperCase() + GenericFont?.slice(1) : undefined

  return ExternalFont ?? GenericFontResolved ?? NULLABLE
}

export const getSupportedFontWeight = (contents: string[]): Nullable<string> => {
  const weight = contents.find((c) => c.length === 3 && isNumber(c) && c.endsWith('00'))

  return weight ?? NULLABLE
}

export const getSupportedFlexDirection = (contents: string[]): Nullable<string> => {
  const Column = contents.find((c) => c === 'col')
  const ColumnReverse = contents.find((c) => c === 'col-reverse')
  const Row = contents.find((c) => c === 'row')
  const RowReverse = contents.find((c) => c === 'row-reverse')

  const ColumnReturn = Column ? 'column' : undefined
  const ColumnReverseReturn = ColumnReverse ? 'column-reverse' : undefined
  const RowReturn = Row ? 'row' : undefined
  const RowReverseReturn = RowReverse ? 'row-reverse' : undefined

  return RowReturn ?? ColumnReturn ?? RowReverseReturn ?? ColumnReverseReturn ?? NULLABLE
}

export const getSupportedFlexGrow = (contents: string[]): Nullable<string> => {
  const Grow = contents.find((c) => c === 'grow')
  const GrowNone = contents.find((c) => c === 'grow-none')

  const GrowReturn = Grow ? '1' : undefined
  const GrowNoneReturn = GrowNone ? '0' : undefined

  return GrowReturn ?? GrowNoneReturn ?? NULLABLE
}

export const getSupportedFlexWrap = (contents: string[]): Nullable<string> => {
  const Wrap = contents.find((c) => c === 'wrap')
  const WrapReverse = contents.find((c) => c === 'wrap-reverse')
  const WrapNone = contents.find((c) => c === 'nowrap')

  return Wrap ?? WrapReverse ?? WrapNone ?? NULLABLE
}

export const getSupportedAlignContent = (ctx: UnunuraGenerateContext): Nullable<string> => {
  const asFlex = ctx.contents.find((c) => isFlexHorizontal(c)) ?? NULLABLE
  const asFlexResolved = !isNullable(asFlex) ? asFlex : NULLABLE

  const normalized =
    {
      start: 'flex-start',
      end: 'flex-end',
      between: 'space-between',
      around: 'space-around',
      evenly: 'space-evenly',
    }[asFlexResolved] || asFlexResolved

  return normalized
}

export const getSupportedAlignSelf = (ctx: UnunuraGenerateContext): Nullable<string> => {
  const asFlex = ctx.contents.find((c) => isFlexVertical(c)) ?? NULLABLE
  const asFlexResolved = !isNullable(asFlex) ? asFlex : NULLABLE

  const normalized =
    {
      start: 'flex-start',
      end: 'flex-end',
    }[asFlexResolved] || asFlexResolved

  return normalized
}

export const getSupportedAlignItems = (ctx: UnunuraGenerateContext): Nullable<string> => {
  const asFlex = ctx.contents.find((c) => isFlexVertical(c)) ?? NULLABLE
  const asFlexResolved = !isNullable(asFlex) ? asFlex : NULLABLE

  const normalized =
    {
      start: 'flex-start',
      end: 'flex-end',
    }[asFlexResolved] || asFlexResolved

  return normalized
}

export const getSupportedJustifyContent = (ctx: UnunuraGenerateContext): Nullable<string> => {
  const asFlex = ctx.contents.find((c) => isFlexHorizontal(c)) ?? NULLABLE
  const asFlexResolved = !isNullable(asFlex) ? asFlex : NULLABLE

  const normalized =
    {
      start: 'flex-start',
      end: 'flex-end',
      between: 'space-between',
      around: 'space-around',
      evenly: 'space-evenly',
    }[asFlexResolved] || asFlexResolved

  return normalized
}

export const getSupportedJustifyItems = (ctx: UnunuraGenerateContext): Nullable<string> => {
  return ctx.contents.find((c) => isJustifyAlign(c)) ?? NULLABLE
}

export const getSupportedJustifySelf = (ctx: UnunuraGenerateContext): Nullable<string> => {
  return ctx.contents.find((c) => isJustifySelf(c)) ?? NULLABLE
}

export const getSupportedScrollDirection = (contents: string[]): Nullable<string> => {
  const x = contents.find((c) => c === 'x')
  const y = contents.find((c) => c === 'y')

  if (!x && !y) return ''

  if (x) return `-${x}`
  if (y) return `-${y}`

  return NULLABLE
}

export const getSupportedScroll = (contents: string[]): string => {
  return contents.find((c) => isScroll(c)) ?? 'scroll'
}

export const getSupportedNumber = (ctx: UnunuraGenerateContext): Nullable<string> => {
  const [defUnit, defMultiplier] = getExistentDefaultUnit(ctx)
  const extended = getExtendedSupporterUnits(ctx)

  const suffixed = ctx.contents.find((c) => isNumberSuffix(c) && isNumber(c[0]))

  const def = ctx.contents.find((c) => isNumber(c) && isNumber(c[0]))
  const defSet = def?.endsWith('px') ? def : def ? `${Number(def) * defMultiplier}${defUnit}` : undefined

  return extended ? String(extended) : suffixed ?? defSet ?? NULLABLE
}

export const getSupportedFontSize = (ctx: UnunuraGenerateContext): Nullable<string> => {
  const number = getSupportedNumber(ctx)

  return number ?? NULLABLE
}

export const getSupportedInteger = (contents: string[]): Nullable<string> => {
  return contents.find((c) => Number.isInteger(Number(c))) || NULLABLE
}

export const getSupportedGlobalNone = (contents: string[]): Nullable<string> => {
  return contents.find((c) => c === '?') ?? NULLABLE
}

export const getSupportedGlobalImportant = (contents: string[]): Nullable<string> => {
  return contents.find((c) => c === '!') ?? NULLABLE
}

export const getSupportedCursor = ({ contents }: UnunuraGenerateContext): Nullable<string> => {
  return contents.find((c) => isCursor(c)) ?? NULLABLE
}

export const getSupportedTouch = ({ contents }: UnunuraGenerateContext): Nullable<string> => {
  return contents.find((c) => isTouch(c)) ?? NULLABLE
}

export const getSupportedResize = (contents: string[]): Nullable<string> => {
  const x = contents.find((c) => c === 'resize-x')
  const y = contents.find((c) => c === 'resize-y')
  const def = contents.find((c) => c === 'resize')
  const none = contents.find((c) => c === 'resize-none')

  const resolvedX = x ? 'horizontal' : undefined
  const resolvedY = y ? 'vertical' : undefined
  const resolvedDef = def ? 'both' : undefined
  const resolvedNone = none ? 'none' : undefined

  return resolvedX ?? resolvedY ?? resolvedDef ?? resolvedNone ?? NULLABLE
}
