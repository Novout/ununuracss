import { MEYER_RESET_CSS, NOVOUT_RESET_CSS, REACT_ENTRYPOINT_FN, UnunuraViteOptions } from 'ununura-shared'
import { classesFromRawHtml, classesFromRawJSX } from './ast'

export const getGlobals = (files: string[], options?: UnunuraViteOptions) => {
  const buffer: string[] = []

  files?.forEach((file) => {
    if (options?.jsx && options.jsxIgnoreEntryFile && file.includes(REACT_ENTRYPOINT_FN)) return

    const classes = options?.jsx
      ? classesFromRawJSX(file).map((node) => node.class)
      : classesFromRawHtml(file).map((node) => node.class)

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
