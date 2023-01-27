<template>
  <main class="reset:novout">
    <div
      exactClassName="text:red"
      class="flex:col bg:--background-color-d dark(bg:--background-color-l) h[min 100vh] p[0 0 0 5rem] bg[/vue.png cover]">
      <section>
        <p
          class="text[roboto #111111 4rem 700] shadow[text v-5 h-5 radius-30] p[10rem 0 0 0] dark(text[roboto #EEEEEE 4rem 700])">
          Hello UnunuraCSS!</p>
        <p
          class="dark(p[t 2rem]) m[2rem 0 0 0] text[roboto #333333 1.25rem 200] dark(text[roboto #AAAAAA 1.25rem 200])">
          A Vue 3 + Vite demo.</p>
        <button @click="onClick"
          class="bg:rgba-0-0-0-0.1 shadow[v-5 h-0 blur-20 radius-1 rgba-255-255-0-0.05] text[#111111 roboto 700 1.1rem] p[1rem 2rem 1rem 2rem] m[3rem 0 0 0] style:cursor-pointer rounded:0.75rem dark(text[#EEEEEE roboto 700 1.1rem])">Github</button>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
const onClick = () => {
  window.location.href = 'https://github.com/Novout/ununuracss'
}
</script>