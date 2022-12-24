import {
  CSSResourceSizer,
  isCSSColor,
  isDefaultFont,
  isHex,
  isHSLColor,
  isHTTPSImage,
  isImage,
  isImageRepeat,
  isImageSize,
  isNumber,
  isNumberSuffix,
  isRGBColor,
  isSizer,
  Nullable,
  NULLABLE,
  Option,
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
  const HTTPSImage = contents.find((c) => isHTTPSImage(c))
  const GenericImage = contents.find((c) => isImage(c))

  return HTTPSImage ?? GenericImage ?? NULLABLE
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

export const getSupportedSizer = (contents: string[]): Nullable<`${string}rem`> => {
  const getSizer = (key?: CSSResourceSizer): Option<`${string}rem`> => {
    switch (key) {
      case 'xs':
        return '0.75rem'
      case 'sm':
        return '0.875rem'
      case 'base':
        return '1rem'
      case 'lg':
        return '1.125rem'
      case 'xl':
        return '1.25rem'
      default:
        return undefined
    }
  }

  const target = contents.find((c) => isSizer(c))

  return getSizer(target as CSSResourceSizer) ?? NULLABLE
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

  const WrapReturn = Wrap ? 'wrap' : undefined
  const WrapReverseReturn = WrapReverse ? 'wrap-reverse' : undefined
  const WrapNoneReturn = WrapNone ? 'nowrap' : undefined

  return WrapReturn ?? WrapReverseReturn ?? WrapNoneReturn ?? NULLABLE
}

export const getSupportedNumber = (contents: string[]): Nullable<string> => {
  const suffixed = contents.find((c) => isNumberSuffix(c))
  const def = contents.find((c) => isNumber(c))

  return suffixed ?? (def?.endsWith('px') ? def : `${def}px`) ?? NULLABLE
}

export const getSupportedGlobalNone = (contents: string[]): Nullable<string> => {
  return contents.find((c) => c === 'none') ?? NULLABLE
}
