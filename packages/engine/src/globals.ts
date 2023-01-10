import { MEYER_RESET_CSS, NOVOUT_RESET_CSS } from 'ununura-shared'
import { classesFromRawHtml } from './ast'

export const getGlobals = (files?: string[]) => {
  const globals = files?.reduce((sum, file) => (sum += classesFromRawHtml(file)), '')?.split(' ')
  const asReset = globals?.find((c) => c.startsWith('reset'))

  let setter = ''
  setter += asReset ? getGlobalReset(asReset) : ''

  return setter
}

export const getGlobalReset = (reset?: string): string => {
  if (!reset) return ''

  const [_, target] = reset.split(':')

  const novoutReset = target === 'novout'
  const meyerReset = target === 'meyer'

  if (novoutReset) return NOVOUT_RESET_CSS()
  if (meyerReset) return MEYER_RESET_CSS()

  return ''
}
