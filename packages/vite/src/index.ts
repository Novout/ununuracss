import { UnunuraOptions } from 'ununura-shared'
import type { Plugin } from 'vite'
import { resolvedViteOptions } from './options'
import CORE from './plugins/core'
import EXTERNAL_FONTAINE from './plugins/fontaine'

export const ununura = (options: UnunuraOptions = {}): Plugin[] => {
  const _options = resolvedViteOptions(options)

  return [CORE(_options), EXTERNAL_FONTAINE] as Plugin[]
}
