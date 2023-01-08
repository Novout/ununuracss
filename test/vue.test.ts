import { generateCSSResources, UnunuraVueSFCFile } from "ununura-engine";
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
  <div class="flex[col wrap] w[100%] dark(w[50%])">
    <div class="m[0 10 0 0] p:20 border[5 yellow] pos[absolute right-0 left-0]">
      a some test
    </div>
    <p>m[0 10 0 0]</p>
  </div>
  <div />
</template>`), `<template>
  <div class="flex-col-wrap w-100 w-50-dark">
    <div class="m-0-10-0-0 p-20 border-5-yellow pos-absolute-right-0-left-0">
      a some test
    </div>
    <p>m[0 10 0 0]</p>
  </div>
  <div />
</template>`
  ],
  [UnunuraVueSFCFile(`<template><div class="bg://i.imgur.com/xYz.jpeg" /></template>`), `<template><div class="bg-iimgurcomxyzjpeg" /></template>`],
  [UnunuraVueSFCFile(`<template><div class="bg:/foo.png" /></template>`), `<template><div class="bg-foopng" /></template>`],
  [UnunuraVueSFCFile(`<template><div class="text[1rem white indent-5] w[100%] h[min 50vh]" /></template>`), `<template><div class="text-1rem-white-indent-5 w-100 h-min-50vh" /></template>`]
  ]

  for (const [sfc, result] of targets) {
    expect(sfc).toStrictEqual(result)
  }
})})