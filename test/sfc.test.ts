import { UnunuraScopedSFCFile } from 'ununura-engine'
import { describe, expect, it } from 'vitest'

describe.concurrent('vue', () => {
  it('should transform vue sfc correctly', async () => {
    const sfc = `<template>
  <div class="flex[col v-center h-center]">
    <p class="text[1.1rem 700 red]">Hello!</p>
  </div>
</template>`

    const target = await UnunuraScopedSFCFile(sfc, 'vue', 'app.vue', { scopedInTemplate: true } as any)

    expect(target).toBe(`<template>
  <div class="flex-2-app-col-v-center-h-center">
    <p class="text-3-app-11rem-700-red">Hello!</p>
  </div>
</template>

<style scoped>
.flex-2-app-col-v-center-h-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.text-3-app-11rem-700-red {
  color: red;
  font-size: 1.1rem;
  font-weight: 700;
}
</style>`)
  })
})

describe.concurrent('svelte', () => {
  it('should transform svelte sfc correctly', async () => {
    const sfc = `<template>
  <div class="flex[col v-center h-center]">
    <p class="text[1.1rem 700 red]">Hello!</p>
  </div>
</template>`

    const target = await UnunuraScopedSFCFile(sfc, 'svelte', 'app.svelte', { scopedInTemplate: true } as any)

    expect(target).toBe(`<template>
  <div class="flex-2-app-col-v-center-h-center">
    <p class="text-3-app-11rem-700-red">Hello!</p>
  </div>
</template>

<style>
.flex-2-app-col-v-center-h-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.text-3-app-11rem-700-red {
  color: red;
  font-size: 1.1rem;
  font-weight: 700;
}
</style>`)
  })
})
