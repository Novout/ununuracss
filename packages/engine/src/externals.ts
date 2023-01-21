import { UnunuraOptions } from 'ununura-shared'

export const enforceDefinesInLexer = (raw: string, ununura?: UnunuraOptions): string =>
  ununura?.defines?.reduce((acc, [key, resources]) => acc.replaceAll(key, resources), raw) ?? raw
