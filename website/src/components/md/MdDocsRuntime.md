# Runtime

The **runtime** allows reading and creating classes dynamically, that is, listening for changes in the DOM and creating new classes if necessary.

> It is not included as a plugin to avoid compatibility issues in bundle.

### Use

All functions are exported in packages, thus allowing the use of some specific resource of the engine. After installing the `ununura-engine` package, call the `initRuntime` function in your entry point (src/main.(js|ts) in vue, for example):

```ts
import { initRuntime } from 'ununura-engine'

initRuntime(options)
```

> It is recommended to use the same options passed for vite/webpack.

### IIFE

In the installation section, you can find a standalone version of `initRuntime`.