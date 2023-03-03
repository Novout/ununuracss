import { validateTimersUnit } from './validate'
import { NULLABLE, UnunuraGenerateContext, Nullable } from 'ununura-shared'

export const findResource = (contents: string[], target: string[]) =>
  contents.find((t) => target.some((v) => v === t)) ?? NULLABLE

export const findResourceInStart = (
  contents: string[],
  target: string[],
  options?: {
    onlyValue?: boolean
    onlySpreadValue?: boolean
    validate?: 'timer'
    supporter?: (contents: UnunuraGenerateContext) => Nullable<string>
  }
): string => {
  const resourceContent = contents.find((t) => target.some((v) => t.startsWith(v)))
  const resourceTarget = target.find((t) => contents.some((v) => v.startsWith(t)))

  if (!resourceContent || !resourceTarget) return NULLABLE
  const splitted = resourceContent.replace(resourceTarget, '')

  if (options?.supporter) return options?.supporter({ contents: [splitted], stack: [], buffer: [] })

  if (options?.onlyValue) return splitted
  if (options?.onlySpreadValue) {
    const items = resourceContent.split('-')
    items.shift()

    if (options?.validate === 'timer') {
      const [item] = items

      if (!validateTimersUnit(item)) return NULLABLE
    }

    return items.join('-')
  }

  return resourceContent
}
