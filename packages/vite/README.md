## Example with Vite

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

> ATTENTION! Uses `type: module` in `package.json`

### JSX

To use JSX (whether in React or Vue-JSX), enter the following option:
```ts
export default defineConfig({
  plugins: [ununura({ jsx: true })],
})
```