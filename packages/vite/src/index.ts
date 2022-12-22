import type { Plugin } from 'vite'
import CORE from './plugins/core'

export default (): Plugin[] => {
  return [CORE()].filter(Boolean) as Plugin[]
}
