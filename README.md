# (WIP) UnunuraCSS

A different form to interpreter Atomic CSS focused on vite ecosystem.

<div>
  <img src="https://img.shields.io/github/lerna-json/v/Novout/ununuracss?color=ccc&label=version&logoColor=ccc&style=for-the-badge">
  <img src="https://img.shields.io/github/actions/workflow/status/Novout/ununuracss/test.yml?color=%23cccccc&logoColor=%23cccccc&style=for-the-badge">
</div>

## Features

- Zero dependencies / 0kb default injected css
- No configuration files / full-reload / directives / presets;
- Only class-raw based;
- Dynamic identifiers (rules) with unique/multiple engine;
- Nullable options/classes;
- External contexts integrated (fonts/public files...)

## Motivation

Reading how [UnoCSS](https://github.com/unocss/unocss) was designed, he had the idea of ​​building an engine without presets that automatically understands the needs of the application complete context. 

**ATTENTION!** UnunuraCSS was not designed for medium-large projects that require standardized resources.

## Example with Vue

`pnpm add -D ununura`

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ununura from 'ununura'

export default defineConfig({
  plugins: [vue(), ununura()],
})
```

## Example with Nuxt

`pnpm add -D ununura-nuxt`

```ts
export default defineNuxtConfig({
  modules: ['ununura-nuxt'],
})
```

## Template Example

```html
<template>
  <main class="reset:meyer">
    <div class="flex[col h-center v-center] bg:black w:100% h:100vh text[arial white 2rem 700]">Hello UnunuraCSS!</div>
  </main>
</template>
```

## Syntax

### Unique Resource Examples

`text:arial`

`text:xl`

`p:0.25rem`

`m:5`

`border:2`

`bg:white`

`bg:/image_in_public_file.png`

### Multiple Resource Examples

`text[arial lg #FF00FF]`

`text[yellow bold]`

`p[0 10.5rem]`

`m[10 2rem 0 0]`

`border[1 solid --css-var-color]`

`bg[rgba-255-255-0-0.5 bold]`

`bg[/image_in_public_file.jpeg cover]`
