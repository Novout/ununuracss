import {
  CSSResourceSizer,
  isCSSColor,
  isHex,
  isHSLColor,
  isHTTPSImage,
  isImage,
  isRGBColor,
  isSizer,
  Nullable,
  NULLABLE,
  Option,
} from 'ununura-shared'

export const getSupportedColor = (contents: string[], def: string = 'white') => {
  const HEXColor = contents.find((c) => isHex(c))
  const CSSColor = contents.find((c) => isCSSColor(c))
  const RGBColor = contents.find((c) => isRGBColor(c))
  const HSLColor = contents.find((c) => isHSLColor(c))

  return HEXColor ?? CSSColor ?? RGBColor ?? HSLColor ?? def
}

export const getSupportedImage = (contents: string[]): Nullable<string> => {
  const HTTPSImage = contents.find((c) => isHTTPSImage(c))
  const GenericImage = contents.find((c) => isImage(c))

  return HTTPSImage ?? GenericImage ?? NULLABLE
}

export const getSupportedSizer = (contents: string[]): `${string}rem` => {
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

  return getSizer(target as CSSResourceSizer) ?? '1rem'
}
