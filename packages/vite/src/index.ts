import { resolveOptions } from 'ununura-config'
import { UnunuraResolvableOptions } from 'ununura-shared'
import type { PluginOption } from 'vite'
import CORE from './plugins/core'
import EXTERNAL_FONTAINE from './plugins/fontaine'

export const ununura = async (options?: UnunuraResolvableOptions): Promise<PluginOption[]> => {
  const _options = await resolveOptions(options)

  const plugins: PluginOption[] = [CORE(_options)]

  if (_options.fontainePlugin) plugins.push(EXTERNAL_FONTAINE)

  return plugins
}
