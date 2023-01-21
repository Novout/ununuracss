import { UnunuraScopedSFCFile } from 'ununura-engine'
import { UnunuraResolvableOptions } from 'ununura-shared'
import { beforeEach, describe, expect, it } from 'vitest'

describe.concurrent('scoped resolvers', () => {
  beforeEach(() => {
    Math.random = () => -1
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
          'vue',
          '',
          { scoped: true } as any
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
      [
        UnunuraScopedSFCFile(
          `<template>
<main class="reset:novout">
  <div
    class="flex:col bg:--background-color-d dark(bg:--background-color-l) h[min 100vh] p[0 0 0 5rem] bg[/vue.png cover]">
  <section>
  <p
    class="text[roboto #111111 4rem 700] shadow[text v-5 h-5 radius-30] dark(text[roboto #EEEEEE 4rem 700]) p[10rem 0 0 0]">
      Hello UnunuraCSS!</p>
    <p
      class="dark(p[t 2rem]) m[2rem 0 0 0] text[roboto #333333 1.25rem 200] dark(text[roboto #AAAAAA 1.25rem 200])">
        A Vue 3 + Vite demo.</p>
      <button @click="onClick"
        class="bg:rgba-0-0-0-0.1 shadow[v-5 h-0 blur-20 radius-1 rgba-255-255-0-0.05] dark(text[#EEEEEE roboto 700 1.1rem]) text[#111111 roboto 700 1.1rem] p[1rem 2rem 1rem 2rem] m[3rem 0 0 0] rounded:0.75rem">Github</button>
      </section>
    </div>
  </main>
</template>`,
          'vue',
          '',
          { scoped: true } as any
        ),
        `<template>
<main class="">
  <div
    class="flex-col bg---background-color-d bg---background-color-l-dark h-min-100vh p-0-0-0-5rem bg-vuepng-cover">
  <section>
  <p
    class="text-roboto-111111-4rem-700 shadow-text-v-5-h-5-radius-30 text-roboto-eeeeee-4rem-700-dark p-10rem-0-0-0">
      Hello UnunuraCSS!</p>
    <p
      class="dark .p-t-2rem -2rem-0-0-0 text-roboto-333333-125rem-200 dark .text-roboto-aaaaaa-125rem-200-dark">
        A Vue 3 + Vite demo.</p>
      <button @click="onClick"
        class="bg-rgba-0-0-0-01 shadow-v-5-h-0-blur-20-radius-1-rgba-255-255-0-005 text-eeeeee-roboto-700-11rem-dark text-111111-roboto-700-11rem p-1rem-2rem-1rem-2rem m-3rem-0-0-0 rounded-075rem">Github</button>
      </section>
    </div>
  </main>
</template>

<style scoped>
.flex-col {
  display: flex;
  flex-direction: column;
}
.bg---background-color-d {
  background-color: var(--background-color-d);
}
.dark .bg---background-color-l-dark {
  background-color: var(--background-color-l);
}
.h-min-100vh {
  min-height: 100vh;
}
.p-0-0-0-5rem {
  padding: 0px 0px 0px 5rem;
}
.bg-vuepng-cover {
  background-image: url("/vue.png");
  background-size: cover;
}

.text-roboto-111111-4rem-700 {
  color: #111111;
  font-size: 4rem;
  font-weight: 700;
  font-family: 'Roboto', sans-serif;
}
.shadow-text-v-5-h-5-radius-30 {
  text-shadow: 5px 5px black;
}
.dark .text-roboto-eeeeee-4rem-700-dark {
  color: #EEEEEE;
  font-size: 4rem;
  font-weight: 700;
  font-family: 'Roboto', sans-serif;
}
.p-10rem-0-0-0 {
  padding: 10rem 0px 0px 0px;
}

.dark .p-t-2rem-dark {
  padding-top: 2rem;
}
.m-2rem-0-0-0 {
  margin: 2rem 0px 0px 0px;
}
.text-roboto-333333-125rem-200 {
  color: #333333;
  font-size: 1.25rem;
  font-weight: 200;
  font-family: 'Roboto', sans-serif;
}
.dark .text-roboto-aaaaaa-125rem-200-dark {
  color: #AAAAAA;
  font-size: 1.25rem;
  font-weight: 200;
  font-family: 'Roboto', sans-serif;
}

.bg-rgba-0-0-0-01 {
  background-color: rgba(0, 0, 0, 0.1);
}
.shadow-v-5-h-0-blur-20-radius-1-rgba-255-255-0-005 {
  box-shadow: 0px 5px 20px 1px rgba(255, 255, 0, 0.05);
  -webkit-box-shadow: 0px 5px 20px 1px rgba(255, 255, 0, 0.05);
  -moz-box-shadow: 0px 5px 20px 1px rgba(255, 255, 0, 0.05);
}
.dark .text-eeeeee-roboto-700-11rem-dark {
  color: #EEEEEE;
  font-size: 1.1rem;
  font-weight: 700;
  font-family: 'Roboto', sans-serif;
}
.text-111111-roboto-700-11rem {
  color: #111111;
  font-size: 1.1rem;
  font-weight: 700;
  font-family: 'Roboto', sans-serif;
}
.p-1rem-2rem-1rem-2rem {
  padding: 1rem 2rem 1rem 2rem;
}
.m-3rem-0-0-0 {
  margin: 3rem 0px 0px 0px;
}
.rounded-075rem {
  border-radius: 0.75rem;
}
</style>`,
      ],
    ]

    for (const [sfc, result] of targets) {
      expect(sfc).toStrictEqual(result)
    }
  })
})
