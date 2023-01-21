// Generics
export type Option<T> = T | undefined
export type Nullable<T> = T | '__NULLABLE__'
export type CSSInject<T extends string | Promise<string> = string> = T
export type ArrTuple<T extends string | number> = [T, T][]

// SFC's
// TODO: <template>${string}</template><script scoped>${string}</script>
export type VueSFC = string
// TODO: <template>${string}</template><script>${string}</script>
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
export type UnunuraContextualizePseudoElement =
  | 'after'
  | 'before'
  | 'cue'
  | 'first-letter'
  | 'first-line'
  | 'selection'
  | 'slotted'
  | 'backdrop'
  | 'placeholder'
  | 'marker'
  | 'spelling-error'
  | 'grammar-error'
export type UnunuraContextualize =
  | UnunuraContextualizeTheme
  | UnunuraContextualizeResponsive
  | UnunuraContextualizePseudoClasses
  | UnunuraContextualizePseudoElement
export type UnunuraContextualizeStack = UnunuraContextualize[]

// CSS Supports
export type CSSResourceSizer = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | `${string}xl`
