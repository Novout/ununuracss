import { UnunuraOptions, UnunuraResolvableOptions } from 'ununura-shared'

export const resolvedViteOptions = (options: UnunuraResolvableOptions = {}): UnunuraOptions => {
  let _options = {} as UnunuraOptions
  _options.defines = options?.defines ?? []
  _options.jsx = options?.jsx ?? false
  _options.jsxIgnoreEntryFile = options?.jsxIgnoreEntryFile ?? true
  _options.scoped = options?.scoped ?? true
  _options.extend = options?.extend ?? {}

  return _options
}
