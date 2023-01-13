import type { Plugin } from 'vite'
import { UnunuraGlobalGenerate, UnunuraSvelteSFCFile, UnunuraVueSFCFile } from 'ununura-engine'
import { isVueFile, VIRTUAL_CSS_INJECT_FILENAME, RESOLVED_VIRTUAL_CSS_INJECT_FILENAME, isSvelteFile } from 'ununura-shared'
import { reloadServer } from '../hot'
import { validForUpdate } from '../support'

export default (): Plugin => {
  return {
    name: 'ununuracss:core',
    enforce: 'pre',
    transform(code, id) {
      if (isVueFile(id)) {
        return UnunuraVueSFCFile(code)
      }

      if (isSvelteFile(id)) {
        return UnunuraSvelteSFCFile(code)
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
