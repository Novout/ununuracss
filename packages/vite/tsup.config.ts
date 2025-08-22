import { defineConfig } from 'tsup'

export default defineConfig({
  inject: ['inject-shim.ts'],
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  clean: true,
  dts: true,
  external: ['vite', 'fontaine', 'babel-jsx-to-ast-fragmented'],
})
