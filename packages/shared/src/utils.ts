import { NULLABLE } from './constants'

export const findResource = (contents: string[], target: string[]) =>
  contents.find((t) => target.some((v) => v === t)) ?? NULLABLE
export const findResourceInStart = (contents: string[], target: string[]) =>
  contents.find((t) => target.some((v) => t.startsWith(v))) ?? NULLABLE
