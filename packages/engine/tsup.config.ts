import { defineConfig } from 'tsup'

export default defineConfig({
  inject: ['inject-shim.ts'],
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  clean: true,
  dts: true,
  external: ['autoprefixer', 'postcss', 'nanoid'],
})
