import { UnunuraOptions } from 'ununura-shared'

export const resolvedViteOptions = (options: UnunuraOptions = {}) => {
  let _options = {} as UnunuraOptions
  _options.jsx = options?.jsx ?? false
  _options.jsxIgnoreEntryFile = options?.jsxIgnoreEntryFile ?? true
  _options.presets = options?.presets ?? []

  return _options
}
