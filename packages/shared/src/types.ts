// Generics
export type Maybe<T> = T | undefined | null
export type Awaitable<T> = T | Promise<T>
export type Nullable<T> = T | '__NULLABLE__'
export type CSSInject<T extends string | Promise<string> = string> = T

// Ununura Options
export type Symbol = string | number

export type Tuple<T extends Symbol> = [T, T]
export type TupleWithOptions<T extends Symbol, K = Record<any, any>> = [T, T, K]
export type ArrTuple<T extends Symbol> = Tuple<T>[]
export type ArrTupleWithOptions<T extends Symbol, K = {}> = TupleWithOptions<T, K>[]
export type TupleOption<K extends Symbol = Symbol, O = Record<any, any>> = (Tuple<K> | TupleWithOptions<K, O>)[]

export type Object = Record<Symbol, Symbol>
export type ObjectWithOptions<T> = Record<Symbol, { value: Symbol; options?: T }>

export type Option<O extends Symbol = Symbol, T = Record<O, any>> = TupleOption<O> | Object | ObjectWithOptions<T>
export type ValueOption<T extends Symbol = Symbol> = ArrTuple<T> | Object

// SFC's
// TODO: <template>${string}</template><script scoped>${string}</script>
export type VueSFC = string
// TODO: <template>${string}</template><script>${string}</script>
export type SvelteSFC = string
export type JSXSFC = string
export type AstroSFC = string
export type SFC = VueSFC | SvelteSFC | JSXSFC | AstroSFC
export type SFCType = 'vue' | 'svelte' | 'astro'

// Ununura Defaults
export type UnunuraDefOrExtended = string

export type UnunuraBounce = 'padding' | 'margin' | 'border' | 'text' | 'background' | 'flex' | 'grid' | UnunuraDefOrExtended
export type UnunuraContextualizeTheme = 'light' | 'dark' | 'sepia' | UnunuraDefOrExtended
export type UnunuraContextualizeResponsive = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | UnunuraDefOrExtended
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
  | UnunuraDefOrExtended
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
  | UnunuraDefOrExtended
export type UnunuraContextualize =
  | UnunuraContextualizeTheme
  | UnunuraContextualizeResponsive
  | UnunuraContextualizePseudoClasses
  | UnunuraContextualizePseudoElement
export type UnunuraContextualizeStack = UnunuraContextualize[]

// CSS Supports
export type CSSResourceSizer = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | `${string}xl` | UnunuraDefOrExtended
