import { loadConfig } from 'c12'
import { UnunuraOptions, UnunuraResolvableOptions, DEFAULT_ADAPTERS } from 'ununura-shared'

export const resolveOptions = async (options?: UnunuraResolvableOptions): Promise<UnunuraOptions> => {
  if (options) return resolvedOptions(options)

  try {
    const { config } = await loadConfig({
      name: 'ununura',
      rcFile: false,
      envName: false,
    })

    return resolvedOptions((config ?? {}) as UnunuraResolvableOptions)
  } catch (e) {
    return resolvedOptions({} as UnunuraResolvableOptions)
  }
}

export const resolvedOptions = (options: UnunuraResolvableOptions = {}): UnunuraOptions => {
  return {
    defines: options?.defines ?? [],
    defaults: options?.defaults ?? {},
    jsx: options?.jsx ?? false,
    jsxIgnoreEntryFile: options?.jsxIgnoreEntryFile ?? true,
    astAdapters: options?.astAdapters
      ? [...options.astAdapters, ...DEFAULT_ADAPTERS()].map((v) => v.toLowerCase())
      : DEFAULT_ADAPTERS().map((v) => v.toLowerCase()),
    scopedInTemplate: options?.scopedInTemplate ?? true,
    extend: options?.extend ?? {},
    specialEnvironment: options?.specialEnvironment ?? 'vite',
    applyAutoprefixer: options?.applyAutoprefixer ?? true,
    overrideBrowserslist: options?.overrideBrowserslist ?? false,
    simplifyTitles: options?.simplifyTitles ?? false,
    hashTitles: options?.hashTitles ?? false,
    forceIgnoreClassLineInTitles: options?.forceIgnoreClassLineInTitles ?? false,
    forceHydratedTemplate: options?.forceHydratedTemplate ?? false,
    forceAlwaysRestartHMRServer: options?.forceAlwaysRestartHMRServer ?? false,
  } as const satisfies UnunuraOptions
}
