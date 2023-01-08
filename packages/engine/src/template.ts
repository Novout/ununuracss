import { UnunuraContextualizeResponsive, UNUNURA_RESPONSIVE } from 'ununura-shared'

export const TemplateClassResponsive = (target: UnunuraContextualizeResponsive, cl: string) => {
  return `@media (min-width: ${UNUNURA_RESPONSIVE(target)}) {\n${cl}\n}`
}
