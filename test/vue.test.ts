import { generateCSSResources, UnunuraScopedSFCFile } from 'ununura-engine'
import { beforeEach, describe, expect, it } from 'vitest'

describe('resolvers', () => {
  beforeEach(() => {
    Math.random = () => -1
  })

  it('should transform correct sfc', () => {
    const targets = [
      [
        generateCSSResources(`<template>
  <div class="p:10 bg:black">
    <div class="border[white]" />
  </div>
</template>
      
<script setup lang="ts>
</script>
`),
        `.p-10 {
  padding: 10px;
}
.bg-black {
  background-color: black;
}
.border-white {
  border-color: white;
}
`,
      ],
      [
        generateCSSResources(`<template><div class="flex[row col-reverse]" /></template>`),
        `.flex-row-col-reverse {
  display: flex;
  flex-direction: row;
}
`,
      ],
    ]

    for (const [sfc, result] of targets) {
      expect(sfc).toStrictEqual(result)
    }
  })

  it('should set new sfc', () => {
    const targets = [
      [
        UnunuraScopedSFCFile(
          `<template>
  <div class="reset:novout flex[col wrap] w[100%] dark(w[50%])">
    <div class="m[0 10 0 0] p:20 border[5 yellow] pos[absolute right-0 left-0]">
      a some test
    </div>
    <p>m[0 10 0 0]</p>
  </div>
  <div />
</template>`,
          'vue'
        ),
        `<template>
  <div class="flex-col-wrap w-100 w-50-dark">
    <div class="m-0-10-0-0 p-20 border-5-yellow pos-absolute-right-0-left-0">
      a some test
    </div>
    <p>m[0 10 0 0]</p>
  </div>
  <div />
</template>

<style scoped>
.flex-col-wrap {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
.w-100 {
  width: 100%;
}
.dark .w-50-dark {
  width: 50%;
}
.m-0-10-0-0 {
  margin: 0px 10px 0px 0px;
}
.p-20 {
  padding: 20px;
}
.border-5-yellow {
  border-color: yellow;
  border-width: 5px;
}
.pos-absolute-right-0-left-0 {
  position: absolute;
  left: 0;
  right: 0;
}
</style>`,
      ],
    ]

    for (const [sfc, result] of targets) {
      expect(sfc).toStrictEqual(result)
    }
  })
})
