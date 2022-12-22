import glob from 'fast-glob'
import { promises as fs } from 'fs'

export const scan = async ({ include, exclude }: { include: string[]; exclude: string[] }): Promise<string[]> => {
  const resources: string[] = []

  const files = await glob(include, { ignore: exclude })

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8')

    resources.push(content)
  }

  return resources
}
