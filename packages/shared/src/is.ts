import { NULLABLE } from './constants'
import { browserFonts, pseudoClass, pseudoElement } from './defines'
import { UnunuraGlobals, UnunuraIdentifier, UnunuraKeys } from './enums'
import {
  Maybe,
  UnunuraContextualizePseudoClasses,
  UnunuraContextualizePseudoElement,
  UnunuraContextualizeResponsive,
} from './types'

export const isDefaultCentralize = (i: string): boolean => ['center', 'left', 'right', 'justify'].some((c) => i === c)
export const isHex = (i: string): boolean => /^#[0-9a-fA-F]{6}/i.test(i)
export const isNumber = (i: string): boolean => /[-]{0,1}[\d]*[.]{0,1}[\d]+/i.test(i)
export const isVueFile = (i: string) => /\.(vue)$/.test(i)
export const isSvelteFile = (i: string) => /\.(svelte)$/.test(i)
export const isAstroFile = (i: string) => /\.(astro)$/.test(i)
export const isScopedSFCFile = (i: string) => isVueFile(i) || isSvelteFile(i)
export const isJSXFile = (i: string) => /\.(jsx|tsx)$/.test(i)
export const isJSXEntryFile = (i: string) => i.match(/main.(jsx|tsx)/)
export const isCSSColor = (i: string): boolean =>
  [
    'AliceBlue',
    'AntiqueWhite',
    'Aqua',
    'Aquamarine',
    'Azure',
    'Beige',
    'Bisque',
    'Black',
    'BlanchedAlmond',
    'Blue',
    'BlueViolet',
    'Brown',
    'BurlyWood',
    'CadetBlue',
    'Chartreuse',
    'Chocolate',
    'Coral',
    'CornflowerBlue',
    'Cornsilk',
    'Crimson',
    'Cyan',
    'DarkBlue',
    'DarkCyan',
    'DarkGoldenRod',
    'DarkGray',
    'DarkGrey',
    'DarkGreen',
    'DarkKhaki',
    'DarkMagenta',
    'DarkOliveGreen',
    'DarkOrange',
    'DarkOrchid',
    'DarkRed',
    'DarkSalmon',
    'DarkSeaGreen',
    'DarkSlateBlue',
    'DarkSlateGray',
    'DarkSlateGrey',
    'DarkTurquoise',
    'DarkViolet',
    'DeepPink',
    'DeepSkyBlue',
    'DimGray',
    'DimGrey',
    'DodgerBlue',
    'FireBrick',
    'FloralWhite',
    'ForestGreen',
    'Fuchsia',
    'Gainsboro',
    'GhostWhite',
    'Gold',
    'GoldenRod',
    'Gray',
    'Grey',
    'Green',
    'GreenYellow',
    'HoneyDew',
    'HotPink',
    'IndianRed',
    'Indigo',
    'Ivory',
    'Khaki',
    'Lavender',
    'LavenderBlush',
    'LawnGreen',
    'LemonChiffon',
    'LightBlue',
    'LightCoral',
    'LightCyan',
    'LightGoldenRodYellow',
    'LightGray',
    'LightGrey',
    'LightGreen',
    'LightPink',
    'LightSalmon',
    'LightSeaGreen',
    'LightSkyBlue',
    'LightSlateGray',
    'LightSlateGrey',
    'LightSteelBlue',
    'LightYellow',
    'Lime',
    'LimeGreen',
    'Linen',
    'Magenta',
    'Maroon',
    'MediumAquaMarine',
    'MediumBlue',
    'MediumOrchid',
    'MediumPurple',
    'MediumSeaGreen',
    'MediumSlateBlue',
    'MediumSpringGreen',
    'MediumTurquoise',
    'MediumVioletRed',
    'MidnightBlue',
    'MintCream',
    'MistyRose',
    'Moccasin',
    'NavajoWhite',
    'Navy',
    'OldLace',
    'Olive',
    'OliveDrab',
    'Orange',
    'OrangeRed',
    'Orchid',
    'PaleGoldenRod',
    'PaleGreen',
    'PaleTurquoise',
    'PaleVioletRed',
    'PapayaWhip',
    'PeachPuff',
    'Peru',
    'Pink',
    'Plum',
    'PowderBlue',
    'Purple',
    'RebeccaPurple',
    'Red',
    'RosyBrown',
    'RoyalBlue',
    'SaddleBrown',
    'Salmon',
    'SandyBrown',
    'SeaGreen',
    'SeaShell',
    'Sienna',
    'Silver',
    'SkyBlue',
    'SlateBlue',
    'SlateGray',
    'SlateGrey',
    'Snow',
    'SpringGreen',
    'SteelBlue',
    'Tan',
    'Teal',
    'Thistle',
    'Tomato',
    'Turquoise',
    'Violet',
    'Wheat',
    'White',
    'WhiteSmoke',
    'Yellow',
    'YellowGreen',
  ].some((c) => c.toLowerCase() === i.toLowerCase())
export const isDefaultFont = (i: string): boolean => [...browserFonts].some((c) => c.toLowerCase() === i.toLowerCase())
export const isImageSize = (i: string) => ['auto', 'cover', 'contain'].some((d) => i.toLowerCase() === d.toLowerCase())
export const isFlexHorizontal = (i: string) =>
  ['start', 'end', 'center', 'between', 'around', 'evenly', 'initial', 'inherit'].some((d) => i === d)
export const isFlexVertical = (i: string) =>
  ['stretch', 'center', 'start', 'end', 'baseline', 'initial', 'inherit'].some((d) => i === d)
export const isJustifyAlign = (i: string) => ['stretch', 'center', 'start', 'end'].some((d) => i === d)
export const isJustifySelf = (i: string) => ['auto', 'stretch', 'center', 'start', 'end'].some((d) => i === d)
export const isImageRepeat = (i: string) =>
  ['repeat', 'no-repeat', 'repeat-x', 'repeat-y', 'repeat-round', 'repeat-space'].some((d) => i.toLowerCase() === d.toLowerCase())
export const isSlashImage = (i: string): boolean => i.startsWith('//')
export const isHTTPSImage = (i: string): boolean => /(https?:\/\/.*\.(?:png|jpg|gif|jpe?g|tiff?|png|webp|bmp))/i.test(i)
export const isImage = (i: string): boolean => /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(i)
export const isBorderStyle = (i: string): boolean => ['solid', 'dotted', 'dashed'].some((c) => c === i)
export const isOutlineStyle = (i: string): boolean => ['solid', 'dotted', 'dashed', 'double'].some((c) => c === i)
export const isSizer = (i: string): boolean => ['xs', 'sm', 'base', 'lg', 'xl'].some((c) => c === i)
export const isScroll = (i: string): boolean => ['scroll', 'hidden', 'auto', 'clip', 'visible'].some((c) => c === i)
export const isCursor = (i: string): boolean =>
  [
    'auto',
    'default',
    'pointer',
    'wait',
    'text',
    'move',
    'help',
    'not-allowed',
    'none',
    'context-menu',
    'progress',
    'cell',
    'crosshair',
    'vertical-text',
    'alias',
    'copy',
    'no-drop',
    'grap',
    'grabbing',
    'all-scroll',
    'col-resize',
    'row-resize',
    'n-resize',
    'e-resize',
    's-resize',
    'w-resize',
    'ne-resize',
    'nw-resize',
    'se-resize',
    'sw-resize',
    'ew-resize',
    'ns-resize',
    'nesw-resize',
    'nwse-resize',
    'zoom-in',
    'zoom-out',
  ].some((c) => c === i)
export const isTouch = (i: string): boolean =>
  ['auto', 'none', 'pan-x', 'pan-left', 'pan-right', 'pan-y', 'pan-up', 'pan-down', 'pinch-down', 'manipulation'].some(
    (c) => c === i
  )
export const isNumberSuffix = (i: string): boolean =>
  [
    'cm',
    'mm',
    'pc',
    'pt',
    'em',
    'ex',
    'ch',
    '%',
    'rem',
    'lh',
    'rlh',
    'vw',
    'vh',
    'vmin',
    'vmax',
    'vb',
    'vi',
    'svw',
    'svh',
    'lvw',
    'lvh',
    'dvw',
    'dvh',
  ].some((c) => i.toLowerCase().endsWith(c.toLowerCase()))

export const isNullable = (i?: Maybe<string>): boolean => i === NULLABLE || i === undefined || i === null
export const isUniqueKey = (key: string) => key === UnunuraKeys.UniqueContext
export const isOpenKey = (key: string) => isUniqueKey(key) || isOpenMultipleKey(key) || isContextOpenKey(key)
export const isOpenMultipleKey = (key: string) => key === UnunuraKeys.MultipleContextOpen
export const isCloseMultipleKey = (key: string) => key === UnunuraKeys.MultipleContextClose
export const isContextOpenKey = (key: string) => key === UnunuraKeys.SpecificContextOpen
export const isContextCloseKey = (key: string) => key === UnunuraKeys.SpecificContextClose
export const isContextKey = (key: string) => isUniqueKey(key) || isOpenMultipleKey(key) || isCloseMultipleKey(key)

export const isKey = (char: string): boolean => Object.values(UnunuraKeys).some((key) => key === char)
export const isGlobal = (str: string): Maybe<string> => Object.values(UnunuraGlobals).find((key) => str.startsWith(key))

export const isThemeContextIdentifier = (str: string) => ['dark', 'light', 'sepia'].find((key) => key === str)
export const isResponsiveContextIdentifier = (str: string): Maybe<UnunuraContextualizeResponsive> =>
  ['xs', 'sm', 'md', 'lg', 'xl']?.find((key) => key === str) as Maybe<UnunuraContextualizeResponsive>
export const isPseudoClassContextIdentifier = (str: string): Maybe<UnunuraContextualizePseudoClasses> =>
  pseudoClass?.find((key) => key === str) as Maybe<UnunuraContextualizePseudoClasses>
export const isPseudoElementContextIdentifier = (str: string): Maybe<UnunuraContextualizePseudoElement> =>
  pseudoElement?.find((key) => key === str) as Maybe<UnunuraContextualizePseudoElement>
export const isContextIdentifier = (str: string) =>
  isThemeContextIdentifier(str) || isResponsiveContextIdentifier(str) || isPseudoClassContextIdentifier(str)
export const isCommonIdentifier = (str: string) => Object.values(UnunuraIdentifier).some((key) => key === str)
export const asCommonIdentifier = (str: string) => Object.values(UnunuraIdentifier).some((key) => str.startsWith(key))
export const isIdentifier = (str: string) => isCommonIdentifier(str) || isContextIdentifier(str)

export const isTransitionProperty = (i: string): boolean =>
  ['all', 'none', 'background', 'color', 'transform'].some((c) => i === c)

export const isTransitionTimingFunction = (i: string): boolean =>
  ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear', 'step-start', 'step-end'].some((c) => i === c)
export const isTypographyOverflow = (i: string): boolean => ['clip', 'ellipsis'].some((c) => i === c)
export const isTypographyTransform = (i: string): boolean => ['uppercase', 'lowercase', 'capitalize'].some((c) => i === c)

export const isVueSFC = (str?: string): boolean => str === 'vue'
