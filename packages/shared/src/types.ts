export type Option<T> = T | undefined
export type Nullable<T> = T | '__NULLABLE__'
export type CSSInject = string

// TODO: <template>${string}</template>
export type VueSFC = string
export type SvelteSFC = string
export type JSXSFC = string
export type SFC = VueSFC | SvelteSFC | JSXSFC
// Ununura Internals
export type UnunuraBounce = 'padding' | 'margin' | 'border' | 'text' | 'background' | 'flex' | 'grid'
export type UnunuraContextualizeTheme = 'light' | 'dark' | 'sepia'
export type UnunuraContextualizeResponsive = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type UnunuraContextualizePseudoClasses =
  | 'hover'
  | 'focus'
  | 'active'
  | 'checked'
  | 'disabled'
  | 'empty'
  | 'enabled'
  | 'first-child'
  | 'first-of-type'
  | 'in-range'
  | 'invalid'
  | 'last-child'
  | 'last-of-type'
  | 'link'
  | 'only-child'
  | 'optional'
  | 'out-of-range'
  | 'read-only'
  | 'read-write'
  | 'required'
  | 'valid'
  | 'visited'
export type UnunuraContextualize = UnunuraContextualizeTheme | UnunuraContextualizeResponsive | UnunuraContextualizePseudoClasses
export type UnunuraContextualizeStack = UnunuraContextualize[]

// CSS Supports
export type CSSResourceSizer = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | `${string}xl`
