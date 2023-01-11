export type Option<T> = T | undefined
export type Nullable<T> = T | '__NULLABLE__'
export type CSSInject = string

// TODO: <template>${string}</template>
export type VueSFC = string

// Ununura Internals
export type UnunuraBounce = 'padding' | 'margin' | 'border' | 'text' | 'background' | 'flex' | 'grid'
export type UnunuraContextualizeTheme = 'light' | 'dark' | 'sepia'
export type UnunuraContextualizeResponsive = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type UnunuraContextualizePseudoClasses = 'hover' | 'focus' | 'active'
export type UnunuraContextualize = UnunuraContextualizeTheme | UnunuraContextualizeResponsive | UnunuraContextualizePseudoClasses
export type UnunuraContextualizeStack = UnunuraContextualize[]

// CSS Supports
export type CSSResourceSizer = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | `${string}xl`
