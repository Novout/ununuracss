import {
  isCSSColor,
  isDefaultFont,
  isFlexHorizontal,
  isFlexVertical,
  isHex,
  isHSLColor,
  isImage,
  isImageRepeat,
  isImageSize,
  isNumber,
  isNumberSuffix,
  isRGBColor,
  isScroll,
  isSlashImage,
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
  const RGBColor = contents.find((c) => isRGBColor(c))
  const HSLColor = contents.find((c) => isHSLColor(c))

  return HEXColor ?? CSSColor ?? RGBColor ?? HSLColor ?? NULLABLE
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

  return GenericFont ? GenericFont?.charAt(0).toUpperCase() + GenericFont?.slice(1) : NULLABLE
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
  const WrapReverse = contents.find((c) => c === 'wrap-r')
  const WrapNone = contents.find((c) => c === 'wrap-n')

  const WrapReverseReturn = WrapReverse ? 'wrap-reverse' : undefined
  const WrapNoneReturn = WrapNone ? 'nowrap' : undefined

  return Wrap ?? WrapReverseReturn ?? WrapNoneReturn ?? NULLABLE
}

export const getSupportedStandardFlex = (contents: string[]): Nullable<string> => {
  return contents.find((c) => c.startsWith('flex-')) ?? NULLABLE
}

export const getSupportedFlexGap = (contents: string[]): Nullable<string> => {
  return contents.find((c) => c.startsWith('gap-')) ?? NULLABLE
}

export const getSupportedFlexVertical = (contents: string[]): Nullable<string> => {
  return contents.find((c) => isFlexVertical(c)) ?? NULLABLE
}

export const getSupportedFlexHorizontal = (contents: string[]): Nullable<string> => {
  return contents.find((c) => isFlexHorizontal(c)) ?? NULLABLE
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
