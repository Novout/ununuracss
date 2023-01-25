import { isGlobal } from 'ununura-shared'

export const validateSpreadAllResource = (resources: string[]): string[] => {
  const normalize = resources.filter((r) => !isGlobal(r))

  const isCorrectLength = normalize.length === 1 || normalize.length === 2 || normalize.length === 4

  if (!isCorrectLength) return []

  return normalize
}

export const validateTimersUnit = (resource: string) => {
  return resource.endsWith('ms') || resource.endsWith('s')
}

export const validatePercentage = (raw: string) => {
  return raw.endsWith('%')
}

export const validateRGBA = (raw: string) => {
  return raw.startsWith('rgba-')
}
