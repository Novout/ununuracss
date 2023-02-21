import { UnunuraResolvableOptions } from 'ununura-shared'
import type { PluginOption } from 'vite'
import { resolvedViteOptions } from './options'
import CORE from './plugins/core'
import EXTERNAL_FONTAINE from './plugins/fontaine'

export const ununura = (options: UnunuraResolvableOptions = {}): PluginOption => {
  const _options = resolvedViteOptions(options)

  return [CORE(_options), EXTERNAL_FONTAINE]
}

export * from './options'
