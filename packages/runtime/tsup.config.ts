import { defineConfig } from 'tsup'

export default defineConfig({
  inject: ['inject-shim.ts'],
  entry: ['src/index.ts'],
  format: ['iife'],
  clean: true,
  dts: true,
})
