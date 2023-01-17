import { UnunuraViteOptions } from 'ununura-shared'

export const resolvedViteOptions = (options: UnunuraViteOptions = {}) => {
  let _options = {} as UnunuraViteOptions
  _options.jsx = options?.jsx ?? false
  _options.jsxIgnoreEntryFile = options?.jsxIgnoreEntryFile ?? true

  return _options
}
