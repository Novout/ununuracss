import { Properties } from 'hast'

export const defaultAdapters = () => {
  return [
    // nuxt-link
    'exactClassName',
  ]
}

export const defaultSFCAdapters = () => {
  return [':class', ':className']
}

export const VueSFC = (adapters?: string[]) => {
  const targets = adapters ? [...defaultSFCAdapters(), ...adapters.map((v) => `:${v}`)] : defaultSFCAdapters()

  const asArrayClassBinding = (properties?: Properties) =>
    Object.keys(properties as Record<any, any>)?.some((property) => targets.find((v) => property === v))

  const getArrayClassBinding = (properties?: Properties): string[] =>
    targets?.reduce((acc, target) => {
      const isValid = asArrayClassBinding(properties)

      if (!isValid || !properties || !properties[target]) return acc

      const isObject = (properties[target] as string)?.startsWith('{')

      const classesFromObject: string[] = (properties[target] as string)
        .split(/(':|":)|[{}]|(, )/)
        .filter(Boolean)
        .map((v) => v.replace(/(':|":)|['",]/, '').trim())
      classesFromObject.unshift('')

      const classesFromTernary: string[] = (properties[target] as string)
        .split(/[?'"{}]/)
        .map((v) => v.trim())
        .filter((v) => v.length > 1)

      return isObject ? [...acc, ...classesFromObject] : [...acc, ...classesFromTernary]
    }, [] as string[]) ?? []

  return { asArrayClassBinding, getArrayClassBinding }
}
