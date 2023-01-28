import { applyAutoprefixer, defaultAdapters } from 'ununura-engine'
import { describe, expect, it } from 'vitest'

describe.concurrent('autoprefixer', () => {
  it('should transform flex correctly', async () => {
    const css = `.foo {
  display: flex;
}`
    const target = await applyAutoprefixer(css, { overrideBrowserslist: false } as any)

    expect(target).toBe(`.foo {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
}`)
  })

  it('should transform grid correctly', async () => {
    const css = `.foo {
  display: grid;
}`
    const target = await applyAutoprefixer(css, { overrideBrowserslist: false } as any)

    expect(target).toBe(`.foo {
  display: -ms-grid;
  display: grid;
}`)
  })
})

describe.concurrent('nuxt', () => {
  it('should search nuxt 3 class-build', async () => {
    expect(defaultAdapters()).containSubset(['exactClassName'])
  })
})
