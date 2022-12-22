import { CSSInject, UnunuraCoreOptions, STANDARD_EXCLUDE_SCAN, STANDARD_INCLUDE_SCAN, VueSFC } from 'ununura-shared'
import { classesFromRawHtml } from './ast'
import { generateCSSResources } from './resources'
import { scan } from './scanner'
import { resolveUnunuraCssName } from './resolvers'

export const UnunuraGenerate = async (options?: UnunuraCoreOptions): Promise<CSSInject> => {
  const files = await scan({
    include: options?.include ?? STANDARD_INCLUDE_SCAN,
    exclude: options?.exclude ?? STANDARD_EXCLUDE_SCAN,
  })

  const resources = files.map((file) => generateCSSResources(file))

  return resources.reduce((sum, file) => (sum += `${file} `), '')
}

export const UnunuraVueSFCFile = (sfc: VueSFC): CSSInject => {
  const raw = classesFromRawHtml(sfc)
  let _code = sfc

  raw.forEach((cl) => {
    const css = resolveUnunuraCssName(cl)

    _code = _code.replaceAll(cl, css)
  })

  return _code
}
