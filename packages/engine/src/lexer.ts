import { isKey, Maybe, UnunuraKeys, UnunuraOptions } from 'ununura-shared'
import { enforceDefinesInLexer } from './externals'
import { isExistentIdentifier } from './unifier'

export const lex = (raw: string, ununura: UnunuraOptions): string[] => {
  const transformers: string[] = []
  const characters = [...enforceDefinesInLexer(raw, ununura)]

  let lexeme: string = ''
  let actually_key: Maybe<UnunuraKeys> = undefined
  let ignorable: boolean = true
  let is_unique_key = false

  for (const char of characters) {
    const valid = isKey(char)

    if ((valid || (char === ' ' && !actually_key)) && char !== '') {
      const normalized = lexeme.trim()

      if (isExistentIdentifier(normalized, ununura)) ignorable = false

      if (normalized && !ignorable) {
        transformers.push(normalized)

        if (is_unique_key) {
          ignorable = true
          is_unique_key = false
        }
      }

      lexeme = ''
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
          lexeme = ''
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
      lexeme += char
    }
  }

  const normalized = lexeme.trim()

  if (isExistentIdentifier(normalized, ununura)) ignorable = false

  if (normalized && !ignorable) transformers.push(normalized)

  return transformers
}

export const lexToRawTitles = (classTitle: string): string[] => {
  let aux = ''

  return (
    classTitle
      ?.split(/ /gi)
      ?.reduce((acc, title) => {
        if (title.includes(']')) {
          aux += ` ${title}`

          const arr = [...acc, aux]
          aux = ''

          return arr
        }

        if (title.includes('[') || aux) {
          aux += ` ${title}`

          return acc
        }

        return [...acc, title]
      }, [] as string[])
      .map((v) => v.trim())
      .filter(Boolean) ?? []
  )
}
