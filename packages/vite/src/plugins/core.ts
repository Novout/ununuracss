import type { PluginOption } from 'vite'
import { createFilter } from '@rollup/pluginutils'
import { UnunuraGlobalGenerate, UnunuraJSXSFCFile, UnunuraScopedSFCFile } from 'ununura-engine'
import {
  isVueFile,
  VIRTUAL_CSS_INJECT_FILENAME,
  RESOLVED_VIRTUAL_CSS_INJECT_FILENAME,
  isSvelteFile,
  isJSXFile,
  getFilename,
  UnunuraOptions,
  isJSXEntryFile,
  isAstroFile,
  STANDARD_EXCLUDE_FILTER_SCAN,
  STANDARD_INCLUDE_FILTER_SCAN,
} from 'ununura-shared'
import { reloadServer } from '../hot'

export default (ununura: UnunuraOptions): PluginOption => {
  const filter = createFilter(STANDARD_INCLUDE_FILTER_SCAN, STANDARD_EXCLUDE_FILTER_SCAN)

  return {
    name: 'ununuracss:core',
    enforce: ununura.forceHydratedTemplate ? 'post' : 'pre',
    async transform(code, id) {
      if (!filter(id)) return

      const filename = getFilename(id)

      if (isVueFile(id)) {
        return { code: await UnunuraScopedSFCFile(code, 'vue', filename, ununura), map: null }
      }

      if (isSvelteFile(id)) {
        return { code: await UnunuraScopedSFCFile(code, 'svelte', filename, ununura), map: null }
      }

      if (isAstroFile(id)) {
        return { code: await UnunuraScopedSFCFile(code, 'astro', filename, ununura), map: null }
      }

      if (isJSXFile(id) && ununura.jsx) {
        if (ununura.jsxIgnoreEntryFile && isJSXEntryFile(id)) return null

        return { code: UnunuraJSXSFCFile(code, filename, ununura), map: null }
      }
    },
    resolveId(id) {
      return id === VIRTUAL_CSS_INJECT_FILENAME ? RESOLVED_VIRTUAL_CSS_INJECT_FILENAME : null
    },
    async load(id) {
      if (id === RESOLVED_VIRTUAL_CSS_INJECT_FILENAME) {
        const code = await UnunuraGlobalGenerate(ununura)

        return { code }
      }
    },
    async handleHotUpdate({ server, file }) {
      if (filter(file)) {
        await reloadServer(server, ununura)
      }
    },
  }
}
