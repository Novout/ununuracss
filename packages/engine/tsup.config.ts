import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs', 'iife'],
  clean: true,
  dts: true,
  external: ['autoprefixer', 'postcss', 'nanoid'],
})
