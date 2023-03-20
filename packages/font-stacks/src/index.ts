// https://github.com/system-fonts/modern-font-stacks

import { FontStack } from 'ununura-shared'

export const getFontFamilyCallback = (
  entry: string,
  stack: FontStack = 'system-ui',
  options?: { emojis?: boolean; semicolon?: boolean }
): string => {
  let inline = entry + ', '

  switch (stack) {
    case 'system-ui':
      inline += 'system-ui, sans-serif'
      break
    case 'transitional':
      inline += "'Charter, 'Bitstream Charter', 'Sitka Text', Cambria, serif'"
      break
    case 'old-style':
      inline += "'Iowan Old Style', 'Palatino Linotype', 'URW Palladio L', P052, serif"
      break
    case 'humanist':
      inline += "Seravek, 'Gill Sans Nova', Ubuntu, Calibri, 'DejaVu Sans', source-sans-pro, sans-serif"
      break
    case 'geometric-humanist':
      inline += "Avenir, 'Avenir Next LT Pro', Montserrat, Corbel, 'URW Gothic', source-sans-pro, sans-serif"
      break
    case 'classical-humanist':
      inline += "Optima, Candara, 'Noto Sans', source-sans-pro, sans-serif"
      break
    case 'neo-grotesque':
      inline += "Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif"
      break
    case 'monospace-slab-serif':
      inline += "'Nimbus Mono PS', 'Courier New', 'Cutive Mono', monospace"
      break
    case 'monospace-code':
      inline += "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace"
      break
    case 'industrial':
      inline += "Bahnschrift, 'DIN Alternate', 'Franklin Gothic Medium', 'Nimbus Sans Narrow', sans-serif-condensed, sans-serif"
      break
    case 'rounded-sans':
      inline +=
        "ui-rounded, 'Hiragino Maru Gothic ProN', Quicksand, Comfortaa, Manjari, 'Arial Rounded MT Bold', Calibri, source-sans-pro, sans-serif"
      break
    case 'slab-serif':
      inline += "Rockwell, 'Rockwell Nova', 'Roboto Slab', 'DejaVu Serif', 'Sitka Small', serif"
      break
    case 'antique':
      inline += "Superclarendon, 'Bookman Old Style', 'URW Bookman', 'URW Bookman L', 'Georgia Pro', Georgia, serif"
      break
    case 'didone':
      inline += "Didot, 'Bodoni MT', 'Noto Serif Display', 'URW Palladio L', P052, Sylfaen, serif"
      break
    case 'handwritten':
      inline += "'Segoe Print', 'Bradley Hand', Chilanka, TSCu_Comic, casual, cursive"
      break
    default:
      inline += 'system-ui, sans-serif'
      break
  }

  if (options?.emojis) inline += ", 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"

  if (options?.semicolon) inline += ';'

  return inline
}
