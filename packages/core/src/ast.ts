import { Content } from 'hast'
import { fromHtml } from 'hast-util-from-html'
import { Root } from 'hast-util-from-html/lib'
import { isIdentifier as isIdentifierKey, isUniqueKey, isCloseMultipleKey, isOpenMultipleKey, Option } from 'ununura-shared'
import { generateMultipleClass, generateUniqueClass } from './resources'

export const classesFromRawHtml = (html: string): string[] => {
  const tree = fromHtml(html, { fragment: true })
  const classes: string[] = []

  const ast = (children: Content[]): void => {
    children.forEach((node) => {
      if (node.type === 'element') {
        if (node.tagName === 'template') ast((node.content as Root).children) // vue sfc

        const target: Option<string> = (node.properties?.className as string[])?.join(' ')

        if (target) classes.push(target)

        if (node.children) ast(node.children)
      }
    })
  }

  ast(tree.children)

  return classes
}

export const generateCss = (keys: string[]): string => {
  const css = []

  let prev_unique: Option<string> = undefined
  let prev_multiple: Option<string> = undefined
  let prev_identifier: Option<string> = undefined

  for (const key of keys) {
    const isUnique = isUniqueKey(key)
    const isOpen = isOpenMultipleKey(key)
    const isEnd = isCloseMultipleKey(key)
    const isIdentifier = isIdentifierKey(key)

    if (isIdentifier) {
      prev_identifier = key
    } else if (isUnique) {
      prev_unique = key
    } else if (isOpen) {
      prev_multiple = key
    } else {
      if (!isEnd) {
        if (prev_unique && prev_identifier) css.push(generateUniqueClass(`${prev_identifier}:${key}`))
        if (prev_multiple && prev_identifier) css.push(generateMultipleClass(`${prev_identifier}:${key}`))
      }

      prev_unique = undefined
      prev_multiple = undefined
      prev_identifier = undefined
    }
  }

  return css.reduce((acc, key) => (acc += `${key}\n`), '')
}
