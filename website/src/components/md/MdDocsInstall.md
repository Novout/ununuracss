# Installation

### Default Vite Setup

`pnpm add -D ununura`

```ts
// in your framework entrypoint

import 'ununura.css'
```

```ts
// Insert ununura plugin in first position

import { ununura } from 'ununura'

export default defineConfig({
  plugins: [ununura(), framework_plugin()],
})
```

### JSX

To use JSX (whether in React or Vue-JSX), enter the following option:

```ts
export default defineConfig({
  plugins: [ununura({ jsx: true })],
})
```

### Nuxt

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

### Astro

`pnpm add -D astro-ununura` or `astro add astro-ununura`

```ts
import { defineConfig } from 'astro/config'
import ununura from 'astro-ununura'

export default defineConfig({
  integrations: [ununura()],
});
```
