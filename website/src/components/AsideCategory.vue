<template>
  <div class="flex[col h-center v-start] w:100%">
    <h2 class="text[quick white 1.3rem 500] p[l 0.5rem] typo[decoration-none] style[cursor-pointer]">{{ title }}</h2>
    <div class="flex[col gap-0.25rem] p[t 0.5rem]" v-for="(route, index) in routes" :key="index">
      <AsideItem :route="route" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Route } from '@/types'

defineProps<{
  title: string
  routes: Route[]
}>()
</script>
