import { UnunuraOptions } from 'ununura-shared'

export const enforcePresetsInLexer = (raw: string, ununura?: UnunuraOptions): string =>
  ununura?.presets?.reduce((acc, [key, resources]) => acc.replaceAll(key, resources), raw) ?? raw
