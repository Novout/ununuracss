import {
  CSSInject,
  UnunuraCoreOptions,
  STANDARD_EXCLUDE_SCAN,
  STANDARD_INCLUDE_SCAN,
  VueSFC,
  SvelteSFC,
  JSXSFC,
  isJSXFile,
} from 'ununura-shared'
import { classesFromRawHtml, classesFromRawJSX, generateCssFromNodes } from './ast'
import { scan } from './scanner'
import { getGlobals } from './globals'

export const UnunuraGlobalGenerate = async (options?: UnunuraCoreOptions): Promise<CSSInject> => {
  const files = await scan({
    include: options?.include ?? STANDARD_INCLUDE_SCAN,
    exclude: options?.exclude ?? STANDARD_EXCLUDE_SCAN,
  })

  const globals = getGlobals(files.map((file) => file.raw))

  if (!options?.jsx) return globals

  return files.reduce((acc, file) => {
    if (!isJSXFile(file.path)) return acc

    const nodes = classesFromRawHtml(file.raw)
    const { css } = generateCssFromNodes(nodes, file.raw, file.filename)

    return (acc += css)
  }, globals)
}

export const UnunuraScopedSFCFile = (sfc: VueSFC | SvelteSFC, type: 'vue' | 'svelte', filename: string): CSSInject => {
  const nodes = classesFromRawHtml(sfc)

  const { code, css } = generateCssFromNodes(nodes, sfc, filename)

  if (css.length === 0) return sfc

  const bufferRaw = css.reduce((acc, css) => (acc += `${css}\n`))

  return `${code}\n\n<style${type === 'vue' ? ' scoped' : ''}>\n${bufferRaw.trimEnd()}\n</style>`
}

export const UnunuraJSXSFCFile = (sfc: JSXSFC, filename: string): CSSInject => {
  const nodes = classesFromRawJSX(sfc)

  const { code } = generateCssFromNodes(nodes, sfc, filename)

  return code
}
