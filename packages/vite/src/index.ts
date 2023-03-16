import { resolveOptions } from 'ununura-config'
import { UnunuraResolvableOptions } from 'ununura-shared'
import type { PluginOption } from 'vite'
import CORE from './plugins/core'
import EXTERNAL_FONTAINE from './plugins/fontaine'

export const ununura = async (options?: UnunuraResolvableOptions): Promise<PluginOption[]> => {
  const _options = await resolveOptions(options)

  return [CORE(_options), EXTERNAL_FONTAINE]
}
