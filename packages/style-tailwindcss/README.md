# TailwindCSS Syntax for UnunuraCSS

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

```ts
import { ununura } from 'ununura'
import { defineConfig } from 'vite'
import tailwindStyle from 'ununura-style-tailwindcss'

export default defineConfig({
  plugins: [
    ununura({
      ...tailwindStyle
    })
  ],
})
```

> IMPORTANT! This import is basically defaults and extend settings.

### Access [ununura.com](https://ununura.com) for more explanations.