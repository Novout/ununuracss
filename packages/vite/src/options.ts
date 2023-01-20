import { UnunuraOptions, UnunuraResolvableOptions } from 'ununura-shared'

export const resolvedViteOptions = (options: UnunuraResolvableOptions = {}): UnunuraOptions => {
  let _options = {} as UnunuraOptions
  _options.presets = options?.presets ?? []
  _options.jsx = options?.jsx ?? false
  _options.jsxIgnoreEntryFile = options?.jsxIgnoreEntryFile ?? true
  _options.scoped = options?.scoped ?? true

  return _options
}
