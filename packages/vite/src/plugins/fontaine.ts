import type { Plugin } from 'vite'
import { FontaineTransform } from 'fontaine'
import { browserFonts, googleFonts } from 'ununura-shared'

const _ = FontaineTransform.vite({
  fallbacks: [...browserFonts, ...googleFonts],
  resolvePath: (id) => new URL('.' + id, import.meta.url),
}) as Plugin

export default _
