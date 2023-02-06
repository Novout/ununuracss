import { UnunuraContextualizeStack, ArrTuple, Option, ValueOption } from './types'

export interface UnunuraGenerateContext {
  stack: UnunuraContextualizeStack
  buffer: string[]
  contents: string[]
  node?: UnunuraASTNode
  filename?: string
  ununura?: UnunuraOptions
}

export interface UnunuraASTNode {
  class: string
  tag: string
  position: {
    start: { line: number; column: number; offset: number }
    end: { line: number; column: number; offset: number }
  }
  flag?: string
}

export interface UnunuraScannerFile {
  raw: string
  path: string
  filename: string
}

export interface UnunuraExtendSupporters {
  colors?: Option<string>
  units?: Option<string | number>
  fonts?: Option<string>
}

export interface UnunuraExtend {
  supporters?: UnunuraExtendSupporters
}

export interface UnunuraResolvableOptions {
  defines?: ValueOption<string>
  extend?: UnunuraExtend
  jsx?: boolean
  jsxIgnoreEntryFile?: boolean
  astAdapters?: string[]
  scopedInTemplate?: boolean
  specialEnvironment?: 'vite' | 'nitro' | 'astro'
  applyAutoprefixer?: boolean
  simplifyTitles?: boolean
  overrideBrowserslist?: string[] | string | false
  forceIgnoreClassLineInTitles?: boolean
  forceHydratedTemplate?: boolean
}

export interface UnunuraOptions {
  defines: ValueOption<string>
  extend: UnunuraExtend
  jsx: boolean
  jsxIgnoreEntryFile: boolean
  astAdapters: string[]
  scopedInTemplate: boolean
  specialEnvironment: 'vite' | 'nitro' | 'astro'
  applyAutoprefixer: boolean
  overrideBrowserslist: string[] | string | false
  simplifyTitles: boolean
  forceIgnoreClassLineInTitles?: boolean
  forceHydratedTemplate: boolean
}

export interface UnunuraCoreOptions extends UnunuraOptions {
  include?: string[]
  exclude?: string[]
}
