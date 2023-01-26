import { isNullable, NULLABLE } from 'ununura-shared'
import { Nullable } from 'ununura-shared'

export const RawRGBAToCssRGB = (raw: string): Nullable<string> => {
  return !isNullable(raw)
    ? `rgba(${raw
        .replace(/rgba/, '')
        .split('-')
        .filter(Boolean)
        .reduce((acc, val) => (acc += `${val}, `), '')
        .slice(0, -2)})`
    : NULLABLE
}
