import { Content, Properties } from 'hast'
import { fromHtml } from 'hast-util-from-html'
import { Root } from 'hast-util-from-html/lib'
import { Node, parse as jsxParse } from 'babel-jsx-to-ast-fragmented'
import {
  UnunuraASTNode,
  Maybe,
} from 'ununura-shared'
import { VueSFC } from './adapters'

export const classesFromRawHtml = (html: string, adapters?: string[]): UnunuraASTNode[] => {
  const tree = fromHtml(html, { fragment: true })
  const classes: UnunuraASTNode[] = []
  const vueSFC = VueSFC(adapters)

  const insert = (node: any, cl: string, flag?: string): UnunuraASTNode => ({
    tag: node.tagName,
    class: cl,
    position: node.position,
    flag,
  })

  const vueEnforces = (node: any) => {
    const arr: UnunuraASTNode[] = []

    const properties = node.properties as Properties

    if (vueSFC.asArrayClassBinding(properties)) {
      // { ':class': "[foo ? 'text:white' : 'text:black']" }
      // { ':class': "{'text:white': foo }"}
      const [_, ...classes] = vueSFC.getArrayClassBinding(properties)

      arr.push(...classes.filter(Boolean).map((cl) => insert(node, cl, 'vbinding')))
    }

    return arr
  }

  const ast = (children: Content[]): void => {
    children.forEach((node) => {
      if (node.type === 'element') {
        if (node.tagName === 'template') ast((node.content as Root).children) // vue sfc

        classes.push(...vueEnforces(node))

        adapters?.forEach((adapter) => {
          if (node.properties && node.properties[adapter]) {
            classes.push(insert(node, node.properties[adapter] as string))
          }
        })

        const target: Maybe<string> = (node.properties?.className as string[])?.join(' ')

        if (target) {
          classes.push(insert(node, target))
        }

        if (node.children) ast(node.children)
      }
    })
  }

  ast(tree.children)

  return classes
}

export const classesFromRawJSX = (jsx: string, adapters?: string[]): UnunuraASTNode[] => {
  const tree = jsxParse(jsx)
  const classes: UnunuraASTNode[] = []

  const ast = (current: Node): void => {
    const cls =
      current.attributes?.filter(({ name }) => adapters?.some((a) => a == name) || name === 'className' || name === 'class') ?? []

    if (cls?.length > 0)
      classes.push(
        ...cls.map((cl) => {
          return {
            tag: cl.name as string,
            class: cl.value as string,
            position: cl.position as any,
          }
        })
      )

    if (current.children) current.children.forEach((target) => ast(target))
  }

  tree?.forEach((fn) => {
    fn?.forEach((el) => {
      ast(el)
    })
  })

  return classes ?? []
}
