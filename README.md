# (WIP) UnunuraCSS

A different form to interpreter Atomic CSS focused on vite ecosystem.

> Version 0.0.1 will only be published when it is stable for basic use.

<div>
  <img src="https://img.shields.io/github/package-json/v/Novout/ununuracss?color=%23cccccc&logoColor=%23cccccc&style=for-the-badge">
  <img src="https://img.shields.io/github/actions/workflow/status/Novout/ununuracss/test.yml?color=%23cccccc&logoColor=%23cccccc&style=for-the-badge">
</div>

## Motivation

Reading how [UnoCSS](https://github.com/unocss/unocss) was designed, he had the idea of ​​building an engine without presets that automatically understands the needs of the application complete context.

**ATTENTION!** UnunuraCSS was not designed for medium-large projects that require standardized resources.

## Use

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ununura from 'ununura-vite'

export default defineConfig({
  plugins: [vue(), ununura()],
})
```

## Example

```vue
<template>
  <div>
    <div class="flex[col wrap] bg:gray text[white xl] p:20">
      <p class="text[white xl bold]">1</p>
      <p class="text:#FF0000">2</p>
      <p class="text:bold">3</p>
    </div>
  </div>
</template>
```

## Features

- Zero dependencies
- No configuration files / full-reload / presets;
- Only class-raw based;
- Dynamic identifiers (rules) with unique/multiple engine;
- Nullable options/classes;
- External contexts integrated (fonts/public files...)

## Syntax

### Unique Resource Examples

`text:roboto`

`text:xl`

`p:0.25`

`m:5`

`border:2`

`bg:white`

`bgi:https://test.png`

### Multiple Resource Examples

`text[roboto lg #FF00FF]`

`text[yellow bold]`

`p[0 10.5]`

`m[10 20 0 0]`

`border[2 dashed hsla(100,100%,53%,0.6)]`

`bg[white]`

`bgi[local_image.jpeg cover]`
