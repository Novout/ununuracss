import { validateTimersUnit } from 'packages/engine/src/validate'
import { NULLABLE } from './constants'

export const findResource = (contents: string[], target: string[]) =>
  contents.find((t) => target.some((v) => v === t)) ?? NULLABLE

export const findResourceInStart = (
  contents: string[],
  target: string[],
  options?: { onlyValue?: boolean; onlySpreadValue?: boolean; validate?: 'timer' }
): string => {
  const resource = contents.find((t) => target.some((v) => t.startsWith(v)))

  if (!resource) return NULLABLE

  if (options?.onlyValue) return resource.split('-')[1]
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
