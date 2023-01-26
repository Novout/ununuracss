import { UnunuraOptions, UnunuraResolvableOptions } from 'ununura-shared'

export const resolvedViteOptions = (options: UnunuraResolvableOptions = {}): UnunuraOptions => {
  let _options = {} as UnunuraOptions
  _options.defines = options?.defines ?? []
  _options.jsx = options?.jsx ?? false
  _options.jsxIgnoreEntryFile = options?.jsxIgnoreEntryFile ?? true
  _options.scopedInTemplate = options?.scopedInTemplate ?? true
  _options.extend = options?.extend ?? {}
  _options.specialEnvironment = options?.specialEnvironment ?? 'vite'
  _options.applyAutoprefixer = options?.applyAutoprefixer ?? true
  _options.simplifyTitles = options?.simplifyTitles ?? false
  _options.forceIgnoreClassLineInTitles = options?.forceIgnoreClassLineInTitles ?? false
  _options.forceHydratedTemplate = options?.forceHydratedTemplate ?? false

  return _options
}
