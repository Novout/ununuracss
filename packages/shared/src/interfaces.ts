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

export interface UnunuraOptions {
  jsx?: boolean
  jsxIgnoreEntryFile?: boolean
  presets?: [string, string][]
}

export interface UnunuraCoreOptions extends UnunuraOptions {
  include?: string[]
  exclude?: string[]
}
