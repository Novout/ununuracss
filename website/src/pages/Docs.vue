<template>
  <div
    class="pos[absolute left-25% top-25%] w:200px h:200px gradient[30deg rgba-200-200-200-0.1 0% rgba-100-100-100-0.1 100%] filter[blur-60px]"
  />
  <div
    class="pos[absolute right-25% top-25%] w:200px h:200px gradient[120deg rgba-200-200-200-0.1 0% rgba-100-100-100-0.1 100%] filter[blur-120px]"
  />
  <div
    class="pos[absolute left-0 bottom-0] w:100px h:100px gradient[120deg rgba-200-200-200-0.2 0% rgba-100-100-100-0.1 100%] filter[blur-80px]"
  />
  <div
    class="h[min 100vh] gradient[0deg rgba-0-0-0-0.2 0% rgba-100-100-100-0.15 100%] bg:#111111 w:100% flex:col z:10 md(flex:row)"
  >
    <Aside />
    <div class="w:100% p:5rem">
      <router-view />
    </div>
  </div>
</template>
