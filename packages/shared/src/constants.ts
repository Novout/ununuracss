import { FontStack } from './types'

export const UNUNURA_FLAG = '__UNUNURACSS__'
export const VIRTUAL_CSS_INJECT_FILENAME = 'ununura.css'
export const RESOLVED_VIRTUAL_CSS_INJECT_FILENAME = '\0' + VIRTUAL_CSS_INJECT_FILENAME

export const STANDARD_INCLUDE_SCAN = ['**/*.{vue,svelte,jsx,tsx,astro}']
export const STANDARD_EXCLUDE_SCAN = ['**/.{nuxt,output}']
export const STANDARD_INCLUDE_FILTER_SCAN = [/\.(vue|svelte|[jt]sx|astro)($|\?)/]
export const STANDARD_EXCLUDE_FILTER_SCAN = [/\.(css|sass|scss|less|stylus|styl)($|\?)/]
export const NULLABLE = '__NULLABLE__'

export const DEFAULT_UNIT: [string, number] = ['px', 1]
export const DEFAULT_FONT_STACK: FontStack = 'system-ui'
export const DEFAULT_RESPONSIVE = {
  xs: '538px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1536px',
}
export const DEFAULT_ADAPTERS = () => {
  return [
    // nuxt-link
    'exactClassName',
    'exact-class-name',
    ':exactClassName',
    ':exact-class-name',
  ]
}
export const DEFAULT_CL = () => {
  return [':class', ':className']
}
