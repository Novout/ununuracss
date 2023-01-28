<template>
  <router-link
    :to="route.to"
    class="text[rubik gray 1.15rem 400] border[3 l gray solid] typo[decoration-none truncate] style[cursor-pointer] m[l 0.8rem] p[0.1rem 0 0.1rem 1.5rem] tr[delay-50ms duration-150ms color ease] hover(text[white 700 1.15rem])"
  >
    {{ route.name }}
  </router-link>
  <div class="flex:col m[l 1rem]" v-for="(target, index) in route.children" :key="index">
    <router-link
      :to="target.to"
      class="text[quick gray 1.05rem 300] typo[decoration-none truncate] style[cursor-pointer] m[l 0.8rem] p[l 1.5rem] tr[delay-20ms duration-100ms color ease] hover(text:white)"
    >
      {{ target.name }}
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { Route } from '@/types'

defineProps<{
  route: Route
}>()
</script>
