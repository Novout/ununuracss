import type { PluginOption } from 'vite'
import { FontaineTransform } from 'fontaine'
import { browserFonts } from 'ununura-shared'

const _ = FontaineTransform.vite({
  fallbacks: [...browserFonts],
  resolvePath: (id) => new URL('.' + id, import.meta.url),
}) as PluginOption

export default _
