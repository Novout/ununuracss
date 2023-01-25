## Example with Astro Integration

`pnpm add -D astro-ununura` or `astro add astro-ununura`

```ts
import { defineConfig } from 'astro/config'
import ununura from 'astro-ununura'

export default defineConfig({
  integrations: [ununura()],
});
```