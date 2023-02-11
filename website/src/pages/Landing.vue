<template>
  <Logo />
  <div
    style="transform: translate(-50%, -50%)"
    class="pos[absolute left-50% top-50%] w:200px h:200px gradient[30deg rgba-200-200-200-1 0% rgba-100-100-100-1 100%] filter[blur-130px] animation[name-light duration-20s iteration-infinite]"
  />
  <main
    class="h[min 100vh] gradient[0deg rgba-0-0-0-0.1 0% rgba-100-100-100-0.15 100%] bg:#111111 w:100% flex[col v-center h-center] z:10"
  >
    <div class="flex[col gap-2rem] m[b 10rem]">
      <h1 class="text[quick 1.35rem 700 primary] typo[center letter-0.05em word-0.1em] z:20 md(text:2.2rem) lg(text:3rem)">
        A <span class="sh[text h-0 v-0 blur-20 primary]">Real</span> CSS Engine. Only Scoped.
      </h1>
      <p class="text[quick 1.05rem 200 white] typo[center letter-0.05em word-0.1em] m[b 1rem] z:20 md(text:1.15rem)">
        Ununura. Powered by Vite.
      </p>
    </div>
    <v-typical
      class="h:10px text[rubik 1.1rem secondary 700] typo[center letter-0.05em] z:20 xs(text:1.2rem) md(text:1.6rem)"
      :steps="typical"
      :loop="Infinity"
      :wrapper="'p'"
    />
    <section class="flex[v-center gap-5rem h-center] m[t 5rem] md(flex:gap-2rem)">
      <router-link
        to="/docs/why"
        class="z:20 style[cursor-pointer] typo[center letter-0.125em decoration-none] text[quick white 1.1rem 300] m[t 4rem] p[1rem 2.5rem] bg:transparent border[1 solid white] rounded:0.5rem hover(bg:white text:black)"
      >
        v{{ version }}
      </router-link>
      <a
        target="_blank"
        href="https://github.com/Novout/ununuracss"
        class="z:20 flex[v-center h-center] shadow[h-0 v-0 blur-100 radius-10 rgba-255-255-255-0.5] text:rgba-255-255-255-0.5 style[cursor-pointer] m[t 4rem] h:60px w:60px bg:transparent border:0 rounded:9999px hover(text:white)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"
          />
        </svg>
      </a>
    </section>
  </main>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { version } from '../../../lerna.json'

const typical = ref([
  'text[1.25rem gray 500]',
  500,
  'text[1.25rem',
  10,
  'text[1.25rem #AAAAAA roboto]',
  300,
  'text[',
  20,
  'text[primary lg roboto] typo[center word-0.05em indent-1rem]',
  500,
  'text:black xl(dark(hover(text:white)))',
  500,
  'flex[col ai-center jc-between] w:100% h[min 100%]',
  500,
  'flex[col ai-center jc-between] w:100% h[min 100',
  20,
  'flex[col ai-center jc-between] w:100% h[min 100vh]',
  600,
  'filter[backdrop blur-130px] bg:rgba-0-0-0-0.2',
  500,
])
</script>
