import { isGlobal, UnunuraGlobals, UnunuraIdentifier } from 'ununura-shared'

export const GlobalTextIndent = (str: string) => {
  const [item, value] = str.split('-')

  return item.startsWith(UnunuraGlobals.TextIndent.valueOf()) ? `  letter-indent: ${value}px` : ''
}

export const GlobalLetterSpacing = (str: string) => {
  const [_a, _b, value] = str.split('-')

  return str.startsWith(UnunuraGlobals.LetterSpacing.valueOf()) ? `  letter-spacing: ${value}px` : ''
}

export const GlobalWordSpacing = (str: string) => {
  const [_a, _b, value] = str.split('-')

  return str.startsWith(UnunuraGlobals.WordSpacing.valueOf()) ? `  word-spacing: ${value}px` : ''
}

export const GlobalBorderRadius = (str: string): string => {
  const [_, value] = str.split('-')

  return str.startsWith(UnunuraGlobals.BorderRadius.valueOf()) ? `  border-radius: ${value}px` : ''
}

export const GlobalFlexStandard = (str: string) => {
  const [item, value] = str.split('-')

  return str.startsWith(UnunuraGlobals.FlexStandard.valueOf()) ? `  ${item}: ${value} ${value} 0%` : ''
}

export const appendGlobals = (identifier: UnunuraIdentifier, contents: string[]): string => {
  return contents.reduce((acc, content) => {
    if (!isGlobal(content)) return acc

    let setter = ''

    switch (identifier) {
      case UnunuraIdentifier.Text: {
        setter += GlobalTextIndent(content)
        setter += GlobalLetterSpacing(content)
        setter += GlobalWordSpacing(content)
        break
      }
      case UnunuraIdentifier.Border: {
        setter += GlobalBorderRadius(content)
        break
      }
      case UnunuraIdentifier.Flexbox: {
        setter += GlobalFlexStandard(content)
        break
      }
    }

    if (!setter) return acc

    return (acc += setter + ';\n')
  }, '')
}
