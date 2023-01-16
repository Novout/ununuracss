import { MEYER_RESET_CSS, NOVOUT_RESET_CSS } from 'ununura-shared'
import { classesFromRawHtml } from './ast'

export const getGlobals = (files?: string[]) => {
  const buffer: string[] = []

  files?.forEach((file) => {
    const classes = classesFromRawHtml(file).map((node) => node.class)

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
