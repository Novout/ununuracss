import { validateTimersUnit } from 'packages/engine/src/validate'
import { getSupportedColor } from 'ununura-engine'
import { NULLABLE } from './constants'
import { isNullable } from './is'
import { Nullable } from './types'

export const findResource = (contents: string[], target: string[]) =>
  contents.find((t) => target.some((v) => v === t)) ?? NULLABLE

export const findResourceInStart = (
  contents: string[],
  target: string[],
  options?: {
    onlyValue?: boolean
    onlySpreadValue?: boolean
    validate?: 'timer'
    supporter?: (contents: string[]) => Nullable<string>
  }
): string => {
  const resource = contents.find((t) => target.some((v) => t.startsWith(v)))

  if (!resource) return NULLABLE
  const splitted = resource.split('-')[1]

  if (options?.supporter) return options?.supporter([splitted])

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

export const getFilename = (id: string) => id.substring(id.lastIndexOf('/') + 1)
