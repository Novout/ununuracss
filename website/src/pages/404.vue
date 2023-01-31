<template>
  <div
    class="pos[absolute left-25% top-25%] w:200px h:200px gradient[30deg rgba-200-200-200-0.1 0% rgba-100-100-100-0.1 100%] filter[blur-60px]" />
  <div
    class="pos[absolute right-25% top-25%] w:200px h:200px gradient[120deg rgba-200-200-200-0.1 0% rgba-100-100-100-0.1 100%] filter[blur-120px]" />
  <div
    class="pos[absolute left-0 bottom-0] w:100px h:100px gradient[120deg rgba-200-200-200-0.2 0% rgba-100-100-100-0.1 100%] filter[blur-80px]" />
  <div class="h[min 100vh] bg:#222222 flex[col gap-2rem h-center v-center] w:100%">
    <p class="text[rubik 4rem 700 #666666]">404 :(</p>
    <router-link
      class="text[rubik 700 1.25rem #777777] border:none typo:decoration-none bg:rgba-0-0-0-0.2 outline[2 black solid] p[1rem 2rem] rounded:1rem"
      to="/">
      Initial Page
    </router-link>
  </div>
</template>