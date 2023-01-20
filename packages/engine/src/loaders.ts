import {
  CSSInject,
  UnunuraCoreOptions,
  STANDARD_EXCLUDE_SCAN,
  STANDARD_INCLUDE_SCAN,
  VueSFC,
  SvelteSFC,
  JSXSFC,
  UnunuraScannerFile,
  UnunuraOptions,
} from 'ununura-shared'
import { classesFromRawHtml, classesFromRawJSX, generateCssFromNodes } from './ast'
import { scan } from './scanner'
import { getGlobals } from './globals'

export const UnunuraGlobalGenerateJSXReduced = (files: UnunuraScannerFile[], initial: string = '', ununura: UnunuraOptions) => {
  const reduced =
    files?.reduce((acc, file) => {
      // TODO: JSX AST Rework ExportedNamedFunctions in common syntax -> export function ...
      // const nodes = !options.scoped && !options.jsx ?  classesFromRawHtml(file.raw) : classesFromRawJSX(file.raw)
      const nodes = classesFromRawHtml(file.raw)
      const { css } = generateCssFromNodes(nodes, file.raw, file.filename, ununura)

      return (acc += `${css.reduce((acc, cl) => (acc += cl), '')}`)
    }, initial) ?? []

  return reduced
}

export const UnunuraGlobalGenerate = async (options: UnunuraCoreOptions): Promise<CSSInject> => {
  const files = await scan({
    include: options?.include ?? STANDARD_INCLUDE_SCAN,
    exclude: options?.exclude ?? STANDARD_EXCLUDE_SCAN,
  })

  const globals = getGlobals(files, options)

  if (!options?.jsx && options?.scoped) return globals

  return UnunuraGlobalGenerateJSXReduced(files, globals, options)
}

export const UnunuraScopedSFCFile = (
  sfc: VueSFC | SvelteSFC,
  type: 'vue' | 'svelte',
  filename: string,
  ununura: UnunuraOptions
): CSSInject => {
  const nodes = classesFromRawHtml(sfc)

  const { code, css } = generateCssFromNodes(nodes, sfc, filename, ununura)

  if (css.length === 0) return sfc

  const bufferRaw = css.reduce((acc, css) => (acc += `${css}\n`))

  if (!ununura.scoped) return code

  return `${code}\n\n<style${type === 'vue' ? ' scoped' : ''}>\n${bufferRaw.trimEnd()}\n</style>`
}

export const UnunuraJSXSFCFile = (sfc: JSXSFC, filename: string, ununura: UnunuraOptions): CSSInject => {
  const nodes = classesFromRawJSX(sfc)

  const { code } = generateCssFromNodes(nodes, sfc, filename, ununura)

  return code
}
