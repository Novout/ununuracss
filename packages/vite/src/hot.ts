import { RESOLVED_VIRTUAL_CSS_INJECT_FILENAME } from 'ununura-shared'
import type { ViteDevServer } from 'vite'

export const reloadServer = async (server: ViteDevServer) => {
  const virtualModule = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_CSS_INJECT_FILENAME)

  if (virtualModule) {
    await server.restart()
    await server.reloadModule(virtualModule)
  }
}
