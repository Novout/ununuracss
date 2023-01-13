import { isSvelteFile, isVueFile } from 'ununura-shared'

export const validForUpdate = (filename: string) => isVueFile(filename) || isSvelteFile(filename)
