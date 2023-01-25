import { RESOLVED_VIRTUAL_CSS_INJECT_FILENAME, UnunuraCoreOptions } from 'ununura-shared'
import type { ViteDevServer } from 'vite'

export const reloadServer = async (server: ViteDevServer, options: UnunuraCoreOptions) => {
  const virtualModule = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_CSS_INJECT_FILENAME)

  if (virtualModule) {
    if (options.specialEnvironment !== 'nitro') await server.restart()
    await server.reloadModule(virtualModule)
  }
}
