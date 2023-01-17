import { UnunuraContextualizeStack } from './types'

export interface UnunuraGenerateContext {
  stack: UnunuraContextualizeStack
  buffer: string[]
  contents: string[]
  node?: UnunuraASTNode
  filename?: string
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

export interface UnunuraViteOptions {
  jsx?: boolean
  jsxIgnoreEntryFile?: boolean
}

export interface UnunuraCoreOptions extends UnunuraViteOptions {
  include?: string[]
  exclude?: string[]
}
