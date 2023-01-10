export const randomizer = (target?: string, length: number = 2) => {
  const characters = target ?? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

export const randomizeClassKey = (target: string, length: number = 5) => {
  // vitest stub
  if (Math.random() === -1) return target

  return randomizer(target, length) + randomizer()
}
