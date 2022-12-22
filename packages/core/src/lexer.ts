import { Option, UnunuraIdentifier, UnunuraKeys } from 'ununura-shared'

export const isKey = (char: string): boolean => {
  return Object.values(UnunuraKeys).some((key) => key === char)
}

export const isIdentifier = (str: string): boolean => {
  return Object.values(UnunuraIdentifier).some((key) => key === str)
}

export const lex = (raw: string): string[] => {
  const transformers: string[] = []
  const characters = [...raw]

  let identifier: string = ''
  let actually_key: Option<UnunuraKeys> = undefined
  let ignorable: boolean = true
  let is_unique_key = false

  for (const char of characters) {
    const isAKey = isKey(char)

    if ((isAKey || (char === ' ' && !actually_key)) && char !== '') {
      const normalized = identifier.toLowerCase().trim()

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

    if (isAKey) {
      switch (char) {
        case UnunuraKeys.MultipleContextOpen:
          actually_key = UnunuraKeys.MultipleContextOpen
          transformers.push(UnunuraKeys.MultipleContextOpen)
          break
        case UnunuraKeys.MultipleContextClose:
          actually_key = UnunuraKeys.MultipleContextClose
          transformers.push(UnunuraKeys.MultipleContextClose)
          ignorable = true
          break
        case UnunuraKeys.UniqueContext:
          transformers.push(UnunuraKeys.UniqueContext)
          is_unique_key = true
          actually_key = undefined
          break
        case UnunuraKeys.Important:
          actually_key = UnunuraKeys.Important
          transformers.push(UnunuraKeys.Important)
          break
      }
    } else {
      identifier += char
    }
  }

  const normalized = identifier.toLowerCase().trim()

  if (isIdentifier(normalized)) ignorable = false

  if (normalized && !ignorable) transformers.push(normalized)

  return transformers
}
