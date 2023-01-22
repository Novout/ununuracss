import { UnunuraContextualizeStack, ArrTuple } from './types'

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
}

export interface UnunuraScannerFile {
  raw: string
  path: string
  filename: string
}

export interface UnunuraExtendSupporters {
  colors?: ArrTuple<string>
  units?: ArrTuple<string>
  fonts?: ArrTuple<string>
}

export interface UnunuraExtend {
  supporters?: UnunuraExtendSupporters
}

export interface UnunuraResolvableOptions {
  defines?: ArrTuple<string>
  jsx?: boolean
  jsxIgnoreEntryFile?: boolean
  scoped?: boolean
  extend?: UnunuraExtend
}

export interface UnunuraOptions {
  defines: ArrTuple<string>
  jsx: boolean
  jsxIgnoreEntryFile: boolean
  scoped: boolean
  extend: UnunuraExtend
}

export interface UnunuraCoreOptions extends UnunuraOptions {
  include?: string[]
  exclude?: string[]
}
