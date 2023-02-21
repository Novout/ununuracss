# Styles

Styles are predefined options to make your life easier. Below, check out some options:

### TailwindCSS Syntax

`pnpm add -D ununura-style-tailwindcss`

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

// class="p:5 text[red-600 lg]"
```