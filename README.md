# UnunuraCSS

A different form to interpreter Atomic CSS focused on vite ecosystem.

<div>
  <img src="https://img.shields.io/github/lerna-json/v/Novout/ununuracss?color=ccc&label=version&logoColor=ccc&style=for-the-badge">
  <img src="https://img.shields.io/github/actions/workflow/status/Novout/ununuracss/test.yml?color=%23cccccc&logoColor=%23cccccc&style=for-the-badge">
</div>

## Features

- [Vue](./packages/vite/README.md), [React/Preact/Vue-JSX](./packages/vite/README.md), [Nuxt](./packages/nuxt/README.md), [Astro](./packages/astro/README.md) and [Svelte](./packages/vite/README.md);
- [Fontaine](https://github.com/danielroe/fontaine) and [PostCSS](https://postcss.org/) integrated;
- 0kb default injected .css;
- Only scoped and native jsx-scoped;
- Class-raw based;
- Extend API;
- No directives / presets;
- Dynamic identifiers (rules) with unique/multiple engine;
- Nullable options/classes;
- External contexts (fonts/public files...).

## Simple Example

```html
<template>
  <main class="reset:meyer">
    <div class="flex[col h-center v-center] border[2 white solid] bg:black w:100% h[min 100vh] scroll[y auto]">
      <p class="text[arial white 2rem 700]">Hello UnunuraCSS!</p>
    </div>
  </main>
</template>
```

## Documentation

### Access [ununura.com](https://ununura.com) for more explanations.