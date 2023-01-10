import { UnunuraContextualizeStack } from './types'

export interface UnunuraCoreOptions {
  include?: string[]
  exclude?: string[]
}

export interface UnunuraGenerateContext {
  stack: UnunuraContextualizeStack
  buffer: string[]
  contents: string[]
}
