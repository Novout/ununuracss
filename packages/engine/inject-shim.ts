import shim_module from 'node:module'
import shim_path from 'node:path'
import shim_url from 'node:url'

globalThis.require = shim_module.createRequire(import.meta.url)
globalThis.__filename = shim_url.fileURLToPath(import.meta.url)
globalThis.__dirname = shim_path.dirname(globalThis.__filename)
