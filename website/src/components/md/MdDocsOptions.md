# Options

The options are inserted by the Vite Ununura plugin.

### Defines

Shorten classes using a single key, for example:

```ts
ununura({
  defines: [
    ['btn', 'style:cursor-pointer p[1rem 2.5rem] rounded:0.5rem bg:purple text:white']
  ]
})

// class="btn m[bottom 2rem]..."
```

### Extend

Extend default settings for special customizations.

```ts
ununura({
  extend: {  
    supporters: { 
      colors: [
        ['primary', '#00FF00']
      ], 
      units: [
        ['lg', '1.5rem']
      ],
      fonts: [
        ['roboto', 'Roboto']
      ]
    }
  }
})

// class="text[primary lg roboto] typo[center indent-1rem]..."
```

> **ATTENTION!** Make sure you are entering a name that does not conflict with the default settings.