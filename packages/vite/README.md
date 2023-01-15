## Example with Vue

`pnpm add -D ununura`

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { ununura } from 'ununura'

export default defineConfig({
  plugins: [vue(), ununura()],
})
```

## Example with Svelte

`pnpm add -D ununura`

> Insert the ununura plugin in first position

```ts
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { ununura } from 'ununura'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ununura(), svelte()],
})
```

> ATTENTION! Insert 'ununura.css' in your svelte/vue entrypoint.

> ATTENTION! Uses `type: module` in `package.json`