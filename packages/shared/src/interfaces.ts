import { UnunuraContextualizeStack } from './types'

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

export interface UnunuraResolvableOptions {
  defines?: [string, string][]
  jsx?: boolean
  jsxIgnoreEntryFile?: boolean
  scoped?: boolean
}

export interface UnunuraOptions {
  defines: [string, string][]
  jsx: boolean
  jsxIgnoreEntryFile: boolean
  scoped: boolean
}

export interface UnunuraCoreOptions extends UnunuraOptions {
  include?: string[]
  exclude?: string[]
}
