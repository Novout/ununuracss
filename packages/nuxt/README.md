# UnunuraCSS for Nuxt

<p align="center">
  <a href="https://ununura.com/">
    <img src="../../.github/logo.png" height="100">
  </a>
  <p align="center">
    A Real CSS Engine. Only Scoped.
  </p>
  <p align="center">
  <img src="https://img.shields.io/github/lerna-json/v/Novout/ununuracss?color=ccc&label=version&logoColor=ccc&style=for-the-badge">
  <img src="https://img.shields.io/github/actions/workflow/status/Novout/ununuracss/test.yml?color=%23cccccc&logoColor=%23cccccc&style=for-the-badge">
</p>
</p>


# Use

`pnpm add -D nuxt-ununura`

```ts
export default defineNuxtConfig({
  modules: [
    'nuxt-ununura'
  ],
  ununura: {
    // Options here
  }
})
```

# Example

```html
// app.vue
<template>
  <div class="reset:meyer">
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>
//...

// index.vue
<template>
  <main>
    <div class="flex[col jc-center ai-center] bg:black w:100% h[min 100vh] text[arial green 2rem 700]">
      Hello Nuxt!
    </div>
  </main>
</template>
```

## Access [ununura.com](https://ununura.com) for more explanations.