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
  return `\n${css}`
    .split('\n.')
    .filter(Boolean)
    .join('{')
    .split('{')
    .filter((v) => !v.startsWith('\n'))
    .map((v) => v.trim())
    .join(' ')
    .replace(/(.dark .|.light .|.sepia .)/, ' ')
}
