import type { Plugin } from 'vite'
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
} from 'ununura-shared'
import { reloadServer } from '../hot'
import { validForUpdate } from '../support'

export default (ununura: UnunuraOptions): Plugin => {
  return {
    name: 'ununuracss:core',
    enforce: 'pre',
    async transform(code, id) {
      const filename = getFilename(id)

      if (isVueFile(id)) {
        return await UnunuraScopedSFCFile(code, 'vue', filename, ununura)
      }

      if (isSvelteFile(id)) {
        return await UnunuraScopedSFCFile(code, 'svelte', filename, ununura)
      }

      if (isJSXFile(id) && ununura.jsx) {
        if (ununura.jsxIgnoreEntryFile && isJSXEntryFile(id)) return null

        return UnunuraJSXSFCFile(code, filename, ununura)
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
      if (validForUpdate(file)) {
        await reloadServer(server, ununura)
      }
    },
  }
}
