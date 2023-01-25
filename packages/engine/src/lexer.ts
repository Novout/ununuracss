import { isIdentifier, isKey, Option, UnunuraKeys, UnunuraOptions } from 'ununura-shared'
import { enforceDefinesInLexer } from './externals'

export const lex = (raw: string, ununura: UnunuraOptions): string[] => {
  const transformers: string[] = []
  const characters = [...enforceDefinesInLexer(raw, ununura)]

  let identifier: string = ''
  let actually_key: Option<UnunuraKeys> = undefined
  let ignorable: boolean = true
  let is_unique_key = false

  for (const char of characters) {
    const valid = isKey(char)

    if ((valid || (char === ' ' && !actually_key)) && char !== '') {
      const normalized = identifier.trim()

      if (isIdentifier(normalized)) ignorable = false

      if (normalized && !ignorable) {
        transformers.push(normalized)

        if (is_unique_key) {
          ignorable = true
          is_unique_key = false
        }
      }

      identifier = ''
      actually_key = undefined
    }

    if (valid) {
      switch (char) {
        case UnunuraKeys.MultipleContextOpen:
          actually_key = UnunuraKeys.MultipleContextOpen
          transformers.push(UnunuraKeys.MultipleContextOpen)
          break
        case UnunuraKeys.MultipleContextClose:
          actually_key = UnunuraKeys.MultipleContextClose
          transformers.push(UnunuraKeys.MultipleContextClose)
          ignorable = true
          identifier = ''
          is_unique_key = false
          break
        case UnunuraKeys.SpecificContextOpen:
          transformers.push(UnunuraKeys.SpecificContextOpen)
          break
        case UnunuraKeys.SpecificContextClose:
          transformers.push(UnunuraKeys.SpecificContextClose)
          break
        case UnunuraKeys.UniqueContext:
          transformers.push(UnunuraKeys.UniqueContext)
          is_unique_key = true
          actually_key = undefined
          break
      }
    } else {
      identifier += char
    }
  }

  const normalized = identifier.trim()

  if (isIdentifier(normalized)) ignorable = false

  if (normalized && !ignorable) transformers.push(normalized)

  return transformers
}
