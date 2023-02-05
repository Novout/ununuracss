import { classesFromRawHtml, UnunuraScopedSFCFile } from 'ununura-engine'
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

  it('should transform class  ternarybinding in common ast correctly', async () => {
    const sfc = `<template>
  <p :class="[foo ? 'text:white cl[truncate screen]' : 'text:black']" />
</template>`

    const target = await classesFromRawHtml(sfc, [])

    expect(target.map((t) => t.class)).toStrictEqual(['text:white cl[truncate screen]', 'text:black'])
  })

  it('should transform class  ternarybinding in same identifiers in ast correctly', async () => {
    const sfc = `<template>
  <p :class="[foo ? 'text:white' : 'text:black']" />
</template>`

    const target = await classesFromRawHtml(sfc, [])

    expect(target.map((t) => t.class)).toStrictEqual(['text:white', 'text:black'])
  })

  it('should transform class ternary binding in multiple classes in ast correctly', async () => {
    const sfc = `<template>
  <p :class="[foo ? 'text:white' : 'text:black']" class="bg:red typo:center" />
</template>`

    const target = await classesFromRawHtml(sfc, [])

    expect(target.map((t) => t.class)).toStrictEqual(['text:white', 'text:black', 'bg:red typo:center'])
  })

  it('should transform class ternary binding in adapter classes correctly', async () => {
    const sfc = `<template>
  <p :class="[foo ? 'text:white' : 'text:black']" bar="bg:red typo:center" />
</template>`

    const target = await classesFromRawHtml(sfc, ['bar'])

    expect(target.map((t) => t.class)).toStrictEqual(['text:white', 'text:black', 'bg:red typo:center'])
  })

  it('should transform class object data in classes correctly', async () => {
    const sfc = `<template>
  <p :class="{ 'text:white bg:black': foo }" />
</template>`

    const target = await classesFromRawHtml(sfc)

    expect(target.map((t) => t.class)).toStrictEqual(['text:white bg:black', 'foo'])
  })

  it('should transform class object data in multiple classes correctly', async () => {
    const sfc = `<template>
  <p :class="{ 'text:white bg:black': foo, 'text:black': bar }" />
</template>`

    const target = await classesFromRawHtml(sfc)

    expect(target.map((t) => t.class)).toStrictEqual(['text:white bg:black', 'foo', 'text:black', 'bar'])
  })

  it('should transform class object data in multiple classes and adapters correctly', async () => {
    const sfc = `<template>
  <p :class="{ 'text:white bg:black': foo, 'text:black': bar }" :baz="{ 'scroll:auto': baz }" />
</template>`

    const target = await classesFromRawHtml(sfc, ['baz'])

    expect(target.map((t) => t.class)).toStrictEqual(['text:white bg:black', 'foo', 'text:black', 'bar', 'scroll:auto', 'baz'])
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
