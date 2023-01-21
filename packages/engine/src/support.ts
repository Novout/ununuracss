import {
  findResource,
  findResourceInStart,
  isCSSColor,
  isCursor,
  isDefaultFont,
  isFlexHorizontal,
  isFlexVertical,
  isGoogleFont,
  isHex,
  isImage,
  isImageRepeat,
  isImageSize,
  isNullable,
  isNumber,
  isNumberSuffix,
  isScroll,
  isSlashImage,
  isTouch,
  Nullable,
  NULLABLE,
} from 'ununura-shared'

export const getSupportedMinOrMax = (contents: string[]): Nullable<string> => {
  const min = contents.find((c) => c === 'min')
  const max = contents.find((c) => c === 'max')

  return min ?? max ?? NULLABLE
}

export const getSupportedColor = (contents: string[]): Nullable<string> => {
  const HEXColor = contents.find((c) => isHex(c))
  const CSSColor = contents.find((c) => isCSSColor(c))

  const RGBColor = findResourceInStart(contents, ['rgb-'], { onlySpreadValue: true })
  const RGBAColor = findResourceInStart(contents, ['rgba-'], { onlySpreadValue: true })
  const HSLColor = findResourceInStart(contents, ['hsl-'], { onlySpreadValue: true })
  const HSLAColor = findResourceInStart(contents, ['hsla-'], { onlySpreadValue: true })

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

  const CSSVar = findResourceInStart(contents, ['--'])
  const CSSVarColorResolved = !isNullable(CSSVar) ? `var(${CSSVar})` : undefined

  const TransparentColor = contents.find((c) => c === 'transparent')
  const CurrentColor = contents.find((c) => c === 'currentColor')

  return (
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

export const getSupportedFont = (contents: string[]): Nullable<string> => {
  const GenericFont = contents.find((c) => isDefaultFont(c))

  // TODO: Dynamic google font search with fonts[google <font-here>] resource
  const GoogleFont = contents.find((c) => isGoogleFont(c))

  const GoogleFontResolved = GoogleFont ? GoogleFont?.charAt(0).toUpperCase() + GoogleFont?.slice(1) : undefined
  const GenericFontResolved = GenericFont ? GenericFont?.charAt(0).toUpperCase() + GenericFont?.slice(1) : undefined

  return GoogleFontResolved ?? GenericFontResolved ?? NULLABLE
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

export const getSupportedStandardFlex = (contents: string[]): Nullable<string> => {
  return contents.find((c) => c.startsWith('flex-')) ?? NULLABLE
}

export const getSupportedFlexGap = (contents: string[]): Nullable<string> => {
  return contents.find((c) => c.startsWith('gap-')) ?? NULLABLE
}

export const getSupportedFlexVertical = (contents: string[]): Nullable<string> => {
  const asFlex = contents.find((c) => isFlexVertical(c)) ?? NULLABLE
  const asFlexResolved = !isNullable(asFlex) ? asFlex.replace('v-', '') : NULLABLE

  const normalized =
    {
      start: 'flex-start',
      end: 'flex-end',
    }[asFlexResolved] || asFlexResolved

  return normalized
}

export const getSupportedFlexHorizontal = (contents: string[]): Nullable<string> => {
  const asFlex = contents.find((c) => isFlexHorizontal(c)) ?? NULLABLE
  const asFlexResolved = !isNullable(asFlex) ? asFlex.replace('h-', '') : NULLABLE

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

export const getSupportedNumber = (contents: string[]): Nullable<string> => {
  const suffixed = contents.find((c) => isNumberSuffix(c) && isNumber(c[0]))

  const def = contents.find((c) => isNumber(c) && isNumber(c[0]))
  const defSet = def?.endsWith('px') ? def : def ? `${def}px` : undefined

  return suffixed ?? defSet ?? NULLABLE
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

export const getSupportedCursor = (contents: string[]): Nullable<string> => {
  return contents.find((c) => isCursor(c)) ?? NULLABLE
}

export const getSupportedTouch = (contents: string[]): Nullable<string> => {
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
