import { generateCSSResources, UnunuraVueSFCFile } from "ununura-core";
import { describe, expect, it } from "vitest";

describe('resolvers', () => {
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
`],
  [
    generateCSSResources(`<template><div class="flex[row col-reverse]" /></template>`),
  `.flex-row-col-reverse {
  display: flex;
  flex-direction: row;
}
`]
    ]

    for (const [sfc, result] of targets) {
      expect(sfc).toStrictEqual(result)
    }
  })

  it('should set new sfc', () => {
    const targets = [
      [UnunuraVueSFCFile(`<template>
  <div>
    <div class="m[0 10 0 0] p:20 border[5 yellow]">
      a some test
    </div>
    <p>m[0 10 0 0]</p>
  </div>
  <div />
</template>`), `<template>
  <div>
    <div class="m-0-10-0-0 p-20 border-5-yellow">
      a some test
    </div>
    <p>m[0 10 0 0]</p>
  </div>
  <div />
</template>`
  ],
  [UnunuraVueSFCFile(`<template><div class="bgi:local_path.png" /></template>`), `<template><div class="bgi-local-pathpng" /></template>`],
  [UnunuraVueSFCFile(`<template><div class="bgi:/he4rt.png" /></template>`), `<template><div class="bgi-he4rtpng" /></template>`]
  ]

  for (const [sfc, result] of targets) {
    expect(sfc).toStrictEqual(result)
  }
})})