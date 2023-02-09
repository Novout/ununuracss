import { UnunuraContextualizeResponsive, UnunuraDefOrExtended, UnunuraGenerateContext, UNUNURA_RESPONSIVE } from 'ununura-shared'

export const TemplateDefaultClass = (head: string, body: string): string => {
  return `${head} {${body}}`
}

export const TemplateClassResponsive = (
  ctx: UnunuraGenerateContext,
  target: Exclude<UnunuraContextualizeResponsive, UnunuraDefOrExtended>,
  cl: string
) => {
  const asDef = ctx.ununura?.defaults?.contexts?.responsive ? ctx.ununura?.defaults?.contexts?.responsive[target] : undefined

  return `@media (min-width: ${asDef ?? UNUNURA_RESPONSIVE(target)}) {\n${cl}\n}`
}
