import { NULLABLE } from './constants'

export const findResource = (contents: string[], target: string[]) =>
  contents.find((t) => target.some((v) => v === t)) ?? NULLABLE

export const findResourceInStart = (contents: string[], target: string[], options?: { onlyValue?: boolean }): string => {
  const resource = contents.find((t) => target.some((v) => t.startsWith(v)))

  if (!resource) return NULLABLE

  if (options?.onlyValue) return resource.split('-')[1] as string

  return resource
}
