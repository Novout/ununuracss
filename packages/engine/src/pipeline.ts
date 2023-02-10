import {
  isUniqueKey,
  isCloseMultipleKey,
  isOpenMultipleKey,
  isCommonIdentifier as isCommonIdentifierKey,
  UnunuraContextualize,
  isContextOpenKey,
  isContextCloseKey,
  isContextIdentifier as isContextIdentifierKey,
  UnunuraContextualizeStack,
  UnunuraASTNode,
  UnunuraOptions,
  SFC,
  Maybe,
} from 'ununura-shared'
import { generateMultipleClass, generateUniqueClass } from './resources'
import { lex, lexToRawTitles } from './lexer'
import { purgeOnlyCssClassTitle } from './purge'
import { asResponsiveInContext } from './unifier'

export const nodesToCSS = (nodes: UnunuraASTNode[], sfc: SFC, filename: string, ununura: UnunuraOptions) => {
  let _code = sfc

  let buffer: string[] = []
  let temp_buffer: string[] = []
  let context_stack: UnunuraContextualizeStack = []

  let prev_unique: Maybe<string> = undefined
  let prev_multiple: Maybe<string> = undefined
  let prev_common_identifier: Maybe<string> = undefined
  let prev_context_identifier: Maybe<UnunuraContextualize> = undefined

  const onPushElement = (key: string, item: string, node: UnunuraASTNode) => {
    const resolvedKey = purgeOnlyCssClassTitle(item)

    if (!key || !resolvedKey) return

    const asResponsive = asResponsiveInContext({
      stack: context_stack,
      buffer,
      contents: [],
      node,
      filename,
      ununura,
    })

    asResponsive ? (_code = _code.replace(` ${key}`, '')) : (_code = _code.replace(key, resolvedKey))

    temp_buffer.push(`${item}\n`)
    buffer.push(`${item}\n`)
  }

  const clearBuffers = () => {
    temp_buffer.length = 0
    context_stack.length = 0
  }

  nodes.forEach((node) => {
    const titles = lexToRawTitles(node.class)

    titles.forEach((title) => {
      const keys = lex(title, ununura)

      for (const key of keys) {
        const isUnique = isUniqueKey(key)
        const isOpen = isOpenMultipleKey(key)
        const isContextOpen = isContextOpenKey(key)
        const isContextClose = isContextCloseKey(key)
        const isEnd = isCloseMultipleKey(key)
        const isCommonIdentifier = isCommonIdentifierKey(key)
        const isContextIdentifier = isContextIdentifierKey(key)

        if (isCommonIdentifier) {
          prev_common_identifier = key
        } else if (isUnique) {
          prev_unique = key
        } else if (isOpen) {
          prev_multiple = key
        } else if (isContextIdentifier) {
          prev_context_identifier = key as UnunuraContextualize
        } else if (isContextOpen) {
          if (prev_context_identifier) context_stack.push(prev_context_identifier)
          prev_context_identifier = undefined
        } else if (isContextClose) {
          context_stack.pop()
        } else {
          if (!isEnd) {
            let item

            if (prev_unique && prev_common_identifier) {
              item = generateUniqueClass([prev_common_identifier, key], {
                stack: context_stack,
                buffer: temp_buffer,
                contents: [],
                node,
                filename,
                ununura,
              }).replace(/__NULLABLE__\n/, '')

              if (item) onPushElement(title, item, node)
            }

            if (prev_multiple && prev_common_identifier) {
              item = generateMultipleClass([prev_common_identifier, key], {
                stack: context_stack,
                buffer: temp_buffer,
                contents: [],
                node,
                filename,
                ununura,
              }).replace(/__NULLABLE__\n/, '')

              if (item) onPushElement(title, item, node)
            }
          }

          prev_unique = undefined
          prev_multiple = undefined
          prev_common_identifier = undefined
        }
      }
    })

    clearBuffers()
  })

  return { code: buffer.length > 0 ? _code : sfc, css: buffer }
}
