import { customRandom, random } from 'nanoid'

export const hashTitleResources = (title: string) => {
  const [identifier, ...resources] = title.split('-')

  const resourceJoin = resources.join('')

  const hash = customRandom(resourceJoin, 8, random)

  return `${identifier}-${hash()}`
}
