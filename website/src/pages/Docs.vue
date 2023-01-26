<template>
  <div
    class="pos[absolute left-25% top-25%] w:200px h:200px gradient[30deg rgba-200-200-200-0.2 0% rgba-100-100-100-0.2 100%] filter[blur-60px]"
  />
  <div
    class="pos[absolute right-25% top-25%] w:200px h:200px gradient[120deg rgba-200-200-200-0.2 0% rgba-100-100-100-0.2 100%] filter[blur-120px]"
  />
  <div
    class="pos[absolute left-0 bottom-0] w:100px h:100px gradient[120deg rgba-200-200-200-0.5 0% rgba-100-100-100-0.5 100%] filter[blur-80px]"
  />
  <div
    class="h[min 100vh] gradient[0deg rgba-0-0-0-0.2 0% rgba-100-100-100-0.15 100%] bg:#111111 w:100% flex[col v-center h-center] z:10"
  >
    <router-view />
  </div>
</template>
