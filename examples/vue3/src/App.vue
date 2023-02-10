<template>
  <main class="reset:novout">
    <div
      class="text-test flex:col bg:#CCCCCC h[min 100vh] p[0 0 0 5rem] bg[/vue.png cover] dark(bg:#222222)">
      <section>
        <p
          class="text[roboto primary 4rem 700] shadow[text v-5 h-5 radius-30] p[10rem 0 0 0] md(text:2rem) dark(text[roboto #CCCCCC 4rem 700] md(text:2rem))">
          Hello UnunuraCSS!</p>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const i = ref<boolean>(true)

onMounted(() => {
  setInterval(() => {
    i.value = !i.value
  }, 2000)
})

const onClick = () => {
  window.location.href = 'https://github.com/Novout/ununuracss'
}
</script>