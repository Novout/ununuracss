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
  const resource = contents.find((t) => target.some((v) => t.startsWith(v)))

  if (!resource) return NULLABLE
  const splitted = resource.substring(resource.indexOf('-') + 1)

  if (options?.supporter) return options?.supporter({ contents: [splitted], stack: [], buffer: [] })

  if (options?.onlyValue) return splitted
  if (options?.onlySpreadValue) {
    const items = resource.split('-')
    items.shift()

    if (options?.validate === 'timer') {
      const [item] = items

      if (!validateTimersUnit(item)) return NULLABLE
    }

    return items.join('-')
  }
  return resource
}
