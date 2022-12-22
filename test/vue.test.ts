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
}.bg-black {
  background-color: black;
}.border-white {
  border: solid;
  border-color: white;
  border-width: 1px;
}`],
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
</template>`]
  ]

  for (const [sfc, result] of targets) {
    expect(sfc).toStrictEqual(result)
  }
})})