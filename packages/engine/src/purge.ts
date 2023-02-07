import { pseudoClass, pseudoElement } from 'ununura-shared'

export const purgeCSS = (buffer: string) => {
  return (
    '.' +
    `\n${buffer}`
      .split('\n.')
      .filter(Boolean)
      .filter((v, i, a) => a.indexOf(v) === i)
      .join('\n.')
      .replace(/__NULLABLE__/, '')
  )
}

export const purgeOnlyCssClassTitle = (css: string): string => {
  let def = `\n${css}`
    .split('\n.')
    .filter(Boolean)
    .join('{')
    .split('{')
    .filter((v) => !v.startsWith('\n'))
    .map((v) => v.trim())
    .join(' ')
    .replace(/(dark .|light .|sepia .)/, ' ')
    .replace(/(.dark .|.light .|.sepia .)/, ' ')

  pseudoClass.forEach((cl) => {
    def = def.replaceAll(`:${cl}`, '')
    def = def.replaceAll(`-${cl}`, '')
  })
  pseudoElement.forEach((cl) => {
    def = def.replaceAll(`-${cl}`, '')
    def = def.replaceAll(`::${cl}`, '')
  })

  return def
}
