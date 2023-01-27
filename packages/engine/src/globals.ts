import { isJSXEntryFile, MEYER_RESET_CSS, NOVOUT_RESET_CSS, UnunuraResolvableOptions, UnunuraScannerFile } from 'ununura-shared'
import { classesFromRawHtml, classesFromRawJSX } from './ast'

export const getGlobals = (files: UnunuraScannerFile[], options?: UnunuraResolvableOptions) => {
  const buffer: string[] = []

  files?.forEach((file) => {
    if (options?.jsx && options.jsxIgnoreEntryFile && isJSXEntryFile(file.filename)) return

    const classes = options?.jsx
      ? classesFromRawJSX(file.raw, options?.astAdapters).map((node) => node.class)
      : classesFromRawHtml(file.raw, options?.astAdapters).map((node) => node.class)

    buffer.push(...classes)
  })

  const bufferReduced = buffer?.reduce((sum, i) => (sum += `${i} `), '') ?? ''

  let setter = ''
  setter += getGlobalReset(bufferReduced)

  return setter
}

export const getGlobalReset = (raw?: string): string => {
  if (!raw) return ''

  const novoutReset = raw.includes('reset:novout')
  const meyerReset = raw.includes('reset:meyer')

  if (novoutReset) return NOVOUT_RESET_CSS()
  if (meyerReset) return MEYER_RESET_CSS()

  return ''
}
