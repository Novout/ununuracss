import { Option, UnunuraKeys } from 'ununura-shared'

export const isKey = (char: string): boolean => {
  return Object.values(UnunuraKeys).some((key) => key === char)
}

export const lex = (raw: string): string[] => {
  const transformers: string[] = []
  const characters = [...raw]

  let identifier: string = ''
  let actually_key: Option<UnunuraKeys> = undefined

  for (const char of characters) {
    const isAKey = isKey(char)

    if ((isAKey || (char === ' ' && !actually_key)) && identifier && char) {
      const normalized = identifier.toLowerCase().trim()

      if (normalized) transformers.push(normalized)

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
          break
        case UnunuraKeys.UniqueContext:
          transformers.push(UnunuraKeys.UniqueContext)
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

  if (normalized) transformers.push(normalized)

  return transformers
}
