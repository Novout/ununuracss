import type { Plugin } from 'vite'
import { UnunuraGlobalGenerate, UnunuraJSXSFCFile, UnunuraScopedSFCFile } from 'ununura-engine'
import {
  isVueFile,
  VIRTUAL_CSS_INJECT_FILENAME,
  RESOLVED_VIRTUAL_CSS_INJECT_FILENAME,
  isSvelteFile,
  isJSXFile,
} from 'ununura-shared'
import { reloadServer } from '../hot'
import { validForUpdate } from '../support'
import { getFilename } from '../transform'

export default (): Plugin => {
  return {
    name: 'ununuracss:core',
    enforce: 'pre',
    transform(code, id) {
      const filename = getFilename(id)

      if (isVueFile(id)) {
        return UnunuraScopedSFCFile(code, 'vue', filename)
      }

      if (isSvelteFile(id)) {
        return UnunuraScopedSFCFile(code, 'svelte', filename)
      }

      if (isJSXFile(id)) {
        return UnunuraJSXSFCFile(code, filename)
      }
    },
    resolveId(id) {
      return id === VIRTUAL_CSS_INJECT_FILENAME ? RESOLVED_VIRTUAL_CSS_INJECT_FILENAME : null
    },
    async load(id) {
      if (id === RESOLVED_VIRTUAL_CSS_INJECT_FILENAME) {
        const code = await UnunuraGlobalGenerate()

        return { code }
      }
    },
    async handleHotUpdate({ server, file }) {
      if (validForUpdate(file)) {
        await reloadServer(server)
      }
    },
  }
}
