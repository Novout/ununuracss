<template>
  <main class="reset:novout">
    <div class="flex:col bg:--background-color h[min 100vh] p[0 0 0 5rem] bg[/vue.png cover]">
      <section class="m[10rem 0 0 0]">
        <p class="text[roboto #EEEEEE 4rem 700]">Hello UnunuraCSS!</p>
        <p class="m[1rem 0 0 0] text[roboto #AAAAAA 1.25rem 200]">A Vue 3 + Vite demo.</p>
        <button @click="onClick" class="bg:rgba-0-0-0-0.1 shadow[v-5 h-0 blur-50 radius-1 green] text[#EEEEEE roboto 700 1.1rem] p[1rem 2rem 1rem 2rem] m[3rem 0 0 0] cursor:pointer rounded:0.75rem">Github</button>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
const onClick = () => {
  window.location.href = 'https://github.com/Novout/ununuracss'
}
</script>