import { UnunuraOptions, UNUNURA_FLAG } from 'ununura-shared'
import { getGlobalReset } from './globals'
import { lexToRawTitles } from './lexer'
import { nodesToCSS } from './pipeline'
import { purgeCSS } from './purge'

export const initRuntime = (ununura: UnunuraOptions) => {
  if (typeof window == 'undefined') return

  let __MUTATE_COUNTER__ = 0

  const defDocument = document

  let injectStyle = defDocument.createElement('style')

  const getTemplate = () => {
    return defDocument.body && defDocument.body.outerHTML
  }

  const getStyle = () => {
    if (!defDocument.querySelector(`#${UNUNURA_FLAG}`)) {
      injectStyle = defDocument.createElement('style')
      injectStyle.id = UNUNURA_FLAG
      defDocument.documentElement.prepend(injectStyle)
    }

    return injectStyle
  }

  const setStyle = (newCss: string) => {
    const rawCss = getStyle().innerHTML

    setTimeout(() => {
      const _style = getStyle()

      const normalizedCss = purgeCSS(rawCss + newCss, true)

      _style.innerHTML = normalizedCss
    }, 0)
  }

  const generate = (targets: Element[]) => {
    const template = getTemplate()

    if (!template || targets.length === 0) return

    const nodes = targets.map((target) => {
      ++__MUTATE_COUNTER__

      return {
        class: target.className,
        tag: target.tagName,
        position: {
          // alternative for scoped items using runtime counter
          start: { line: __MUTATE_COUNTER__, column: __MUTATE_COUNTER__, offset: __MUTATE_COUNTER__ },
          end: { line: __MUTATE_COUNTER__, column: __MUTATE_COUNTER__, offset: __MUTATE_COUNTER__ },
        },
      }
    })

    let { css, titles } = nodesToCSS(nodes, template, UNUNURA_FLAG, ununura)

    if (css.length === 0) return

    targets.forEach((target) => {
      const classes = lexToRawTitles(target.className)

      classes?.forEach((cl) => {
        titles.forEach(([prev, set]) => {
          if (cl === prev) {
            target.className = target.className.replace(prev, set)
          }
        })
      })
    })

    const globalResetRaw = getGlobalReset(targets?.map((t) => t.className).join(' ') ?? '')
    const bufferRaw = css.reduce((acc, css) => (acc += `${css}\n`))
    setStyle(`${globalResetRaw ? `\n${globalResetRaw}` : ''}${bufferRaw}`)
  }

  const MO = new MutationObserver((list, _observer) => {
    const targets: Element[] = []

    list.forEach((item) => {
      if (item.type === 'childList' && item.target !== injectStyle) {
        item.addedNodes.forEach((node) => {
          if (!node) return

          const _node = node as Element

          if (!_node?.className) return

          targets.push(_node)
        })
      } else if (item.type === 'attributes') {
        if (!item.target) return

        const _node = item.target as Element

        if (!_node?.className) return

        targets.push(_node)
      }
    })

    generate(targets)
  })

  MO.observe(defDocument.documentElement || window.document.body, {
    childList: true,
    subtree: true,
    attributes: true,
  })
}
