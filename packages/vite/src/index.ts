import type { Plugin } from 'vite'
import CORE from './plugins/core'
import EXTERNAL_FONTAINE from './plugins/fontaine'

export default (): Plugin[] => {
  return [CORE(), EXTERNAL_FONTAINE] as Plugin[]
}
