import { isNullable, NULLABLE } from 'ununura-shared'
import { getSupportedNumber } from './support'

export const validateSpreadAllResource = (resources: string[]): boolean => {
  const isCorrectLength = resources.length === 1 || resources.length === 2 || resources.length === 4

  if (!isCorrectLength) return false

  return !isNullable(getSupportedNumber(resources))
}
