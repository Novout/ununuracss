import { classesFromRawHtml, UnunuraScopedSFCFile } from 'ununura-engine'
import { describe, expect, it } from 'vitest'

describe.concurrent('vue', () => {
  it('should transform sfc correctly', async () => {
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

  it('should transform responsive sfc correctly', async () => {
    const sfc = `<template>
  <div class="flex[col v-center h-center] md(flex:row)">a some test</div>
</template>`

    const target = await UnunuraScopedSFCFile(sfc, 'vue', 'app.vue', { scopedInTemplate: true } as any)

    expect(target).toBe(`<template>
  <div class="flex-2-app-col-v-center-h-center">a some test</div>
</template>

<style scoped>
.flex-2-app-col-v-center-h-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
@media (min-width: 768px) {
.flex-2-app-col-v-center-h-center {
  display: flex;
  flex-direction: row;
}
}
</style>`)
  })

  it('should transform multiple responsive sfc correctly', async () => {
    const sfc = `<template>
  <div class="text[arial black] md(text:red) lg(text:white) xl(text:orange)">a some test</div>
</template>`

    const target = await UnunuraScopedSFCFile(sfc, 'vue', 'app.vue', { scopedInTemplate: true } as any)

    expect(target).toBe(`<template>
  <div class="text-2-app-arial-black">a some test</div>
</template>

<style scoped>
.text-2-app-arial-black {
  color: black;
  font-family: 'Arial', system-ui, sans-serif;
}
@media (min-width: 768px) {
.text-2-app-arial-black {
  color: red;
}
}

@media (min-width: 1024px) {
.text-2-app-arial-black {
  color: white;
}
}

@media (min-width: 1536px) {
.text-2-app-arial-black {
  color: orange;
}
}
</style>`)
  })

  it('should transform multiple line responsive sfc correctly', async () => {
    const sfc = `<template>
  <p class="text[arial black] md(text:red)">A</p>
  <p class="text[arial white] md(text:black)">B</p>
  <p class="text[arial green] md(text:red)">C</p>
</template>`

    const target = await UnunuraScopedSFCFile(sfc, 'vue', 'app.vue', { scopedInTemplate: true } as any)

    expect(target).toBe(`<template>
  <p class="text-2-app-arial-black">A</p>
  <p class="text-3-app-arial-white">B</p>
  <p class="text-4-app-arial-green">C</p>
</template>

<style scoped>
.text-2-app-arial-black {
  color: black;
  font-family: 'Arial', system-ui, sans-serif;
}
@media (min-width: 768px) {
.text-2-app-arial-black {
  color: red;
}
}

.text-3-app-arial-white {
  color: white;
  font-family: 'Arial', system-ui, sans-serif;
}

@media (min-width: 768px) {
.text-3-app-arial-white {
  color: black;
}
}

.text-4-app-arial-green {
  color: green;
  font-family: 'Arial', system-ui, sans-serif;
}

@media (min-width: 768px) {
.text-4-app-arial-green {
  color: red;
}
}
</style>`)
  })

  it('should transform responsive and theme sfc correctly', async () => {
    const sfc = `<template>
  <div class="text:black dark(text:white md(text:red)) md(text:red)">a some test</div>
</template>`

    const target = await UnunuraScopedSFCFile(sfc, 'vue', 'app.vue', { scopedInTemplate: true } as any)

    expect(target).toBe(`<template>
  <div class="text-2-app-black  text-2-app-white-dark">a some test</div>
</template>

<style scoped>
.text-2-app-black {
  color: black;
}
.dark .text-2-app-white-dark {
  color: white;
}

@media (min-width: 768px) {
.dark .text-2-app-white-dark {
  color: red;
}
}

@media (min-width: 768px) {
.text-2-app-black {
  color: red;
}
}
</style>`)
  })

  it('should ignore unknown classes in transform sfc', async () => {
    const sfc = `<template>
  <p class="bg-red scroll[y auto] text-white w:100%">a some p</p>
</template>`

    const target = await UnunuraScopedSFCFile(sfc, 'vue', 'app.vue', { scopedInTemplate: true } as any)

    expect(target).toBe(`<template>
  <p class="bg-red scroll-2-app-y-auto text-white width-2-app-100">a some p</p>
</template>

<style scoped>
.scroll-2-app-y-auto {
  overflow-y: auto;
}
.width-2-app-100 {
  width: 100%;
}
</style>`)
  })

  it('should ignore unknown classes and removed explicit style scoped from sfc', async () => {
    const sfc = `<template>
  <p class="bg-red text-white">a some test</p>
</template>`

    const target = await UnunuraScopedSFCFile(sfc, 'vue', 'app.vue', { scopedInTemplate: true } as any)

    expect(target).toBe(`<template>
  <p class="bg-red text-white">a some test</p>
</template>`)
  })

  it('should transform class ternary binding in common ast correctly', async () => {
    const sfc = `<template>
  <p :class="[foo ? 'text:white cl[truncate screen]' : 'text:black']" />
</template>`

    const target = await classesFromRawHtml(sfc, [])

    expect(target.map((t) => t.class)).toStrictEqual(['text:white cl[truncate screen]', 'text:black'])
  })

  it('should transform class ternary binding in same identifiers in ast correctly', async () => {
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
