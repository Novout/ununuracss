import { resolvedViteOptions } from 'ununura'
import { getGlobalReset, nodesToCSS, purgeCSS } from 'ununura-engine'
import { UnunuraResolvableOptions, UNUNURA_FLAG } from 'ununura-shared'

declare global {
  interface Window {
    __UNUNURA__?: UnunuraResolvableOptions
  }
}

;(() => {
  if (typeof window == 'undefined') return

  const defDocument = document

  let injectStyle = defDocument.createElement('style')

  const ununura = resolvedViteOptions(window.__UNUNURA__ ?? {})
  ununura.applyAutoprefixer = false
  ununura.scopedInTemplate = false
  ununura.specialEnvironment = 'runtime'

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

  const setStyle = (newCss: string, code: string) => {
    const rawCss = getStyle().innerHTML

    defDocument.body.innerHTML = code

    setTimeout(() => {
      const _style = getStyle()

      const normalizedCss = purgeCSS(rawCss + newCss, true)

      _style.innerHTML = normalizedCss
    }, 0)
  }

  const generate = (targets: Element[]) => {
    const template = getTemplate()

    if (!template || targets.length === 0) return

    const nodes = targets.map((target, index) => ({
      class: target.className,
      tag: target.tagName,
      position: {
        // one-file alternative for scoped items using index key
        start: { line: index, column: index, offset: index },
        end: { line: index, column: index, offset: index },
      },
    }))

    const { code, css } = nodesToCSS(nodes, template, UNUNURA_FLAG, ununura)

    if (css.length === 0) return

    const globalResetRaw = getGlobalReset(targets?.map((t) => t.className).join(' ') ?? '')
    const bufferRaw = css.reduce((acc, css) => (acc += `${css}\n`))
    setStyle(`${globalResetRaw ? `\n${globalResetRaw}` : ''}${bufferRaw}`, code)
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

  setTimeout(() => {
    MO.observe(defDocument.documentElement || window.document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    })
  }, 0)
})()
