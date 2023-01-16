import glob from 'fast-glob'
import { promises as fs } from 'fs'
import { getFilename, UnunuraScannerFile } from 'ununura-shared'

export const scan = async ({ include, exclude }: { include: string[]; exclude: string[] }): Promise<UnunuraScannerFile[]> => {
  const scannerFiles: UnunuraScannerFile[] = []

  const files = await glob(include, { ignore: exclude })

  for (const file of files) {
    const raw = await fs.readFile(file, 'utf8')

    scannerFiles.push({
      raw,
      path: file,
      filename: getFilename(file),
    })
  }

  return scannerFiles
}
