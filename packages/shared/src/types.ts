export type Option<T> = T | undefined
export type Nullable<T> = T | '__NULLABLE__'
export type CSSInject = string

// TODO: <template>${string}</template>
export type VueSFC = string

// Ununura Internals
export type UnunuraBounce = 'padding' | 'margin' | 'border' | 'text' | 'background' | 'flex' | 'grid'

// CSS Supports
export type CSSResourceSizer = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | `${string}xl`
