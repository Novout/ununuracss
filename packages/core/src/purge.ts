export const purgeCSS = (buffer: string) => {
  return (
    '.' +
    `\n${buffer}`
      .split('\n.')
      .filter(Boolean)
      .filter((v, i, a) => a.indexOf(v) === i)
      .join('\n.')
  )
}
