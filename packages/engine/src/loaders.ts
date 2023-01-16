import {
  CSSInject,
  UnunuraCoreOptions,
  STANDARD_EXCLUDE_SCAN,
  STANDARD_INCLUDE_SCAN,
  VueSFC,
  SvelteSFC,
  JSXSFC,
} from 'ununura-shared'
import { classesFromRawHtml, classesFromRawJSX, generateCssFromNodes } from './ast'
import { scan } from './scanner'
import { getGlobals } from './globals'

export const UnunuraGlobalGenerate = async (options?: UnunuraCoreOptions): Promise<CSSInject> => {
  const files = await scan({
    include: options?.include ?? STANDARD_INCLUDE_SCAN,
    exclude: options?.exclude ?? STANDARD_EXCLUDE_SCAN,
  })

  return getGlobals(files)
}

export const UnunuraScopedSFCFile = (sfc: VueSFC | SvelteSFC, type: 'vue' | 'svelte'): CSSInject => {
  const nodes = classesFromRawHtml(sfc)

  const { code, css } = generateCssFromNodes(nodes, sfc)

  if (css.length === 0) return sfc

  const bufferRaw = css.reduce((acc, css) => (acc += `${css}\n`))

  return `${code}\n\n<style${type === 'vue' ? ' scoped' : ''}>\n${bufferRaw.trimEnd()}\n</style>`
}

export const UnunuraJSXSFCFile = (sfc: JSXSFC): CSSInject => {
  const nodes = classesFromRawJSX(sfc)

  const { code } = generateCssFromNodes(nodes, sfc)

  return code
}
