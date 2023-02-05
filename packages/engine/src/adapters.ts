import { Properties } from 'hast'

export const defaultAdapters = () => {
  return [
    // nuxt-link
    'exactClassName',
  ]
}

export const VueSFC = () => {
  const asArrayClassBinding = (properties?: Properties) =>
    Object.keys(properties as Record<any, any>)?.some((property) => property === ':class')

  const getArrayClassBinding = (properties?: Properties) => {
    const isValid = asArrayClassBinding(properties)

    if (!isValid || !properties) return []

    const isObject = (properties[':class'] as string).startsWith('{')

    const classesFromObject = (properties[':class'] as string)
      .split(/(':|":)|[{}]|(, )/)
      .filter(Boolean)
      .map((v) => v.replace(/(':|":)|['",]/, ''))
      .filter(Boolean)
      .map((v) => v.trim())
      .filter(Boolean)
    classesFromObject.unshift('')

    const classesFromTernary = (properties[':class'] as string)
      .split(/[?'"{}]/)
      .map((v) => v.trim())
      .filter((v) => v.length > 1)

    return isObject ? classesFromObject : classesFromTernary
  }

  return { asArrayClassBinding, getArrayClassBinding }
}
