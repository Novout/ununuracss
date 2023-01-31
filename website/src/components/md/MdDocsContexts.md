# Contexts

Context is way for applying context without directly interfering with what is resolved by identifiers, suffixing or prefixing the class as needed. For example, the context `dark` will always apply `.dark .resolved-class-here`, regardless of the created class. Contexts are treated internally as a stack and only the first case found of specific context type is considered (i.e. md(xl(class-here)) will be considered as just md(class-here) because md and xl are part of the same context (responsiveness)).

> ATTENTION! Globals need to be last in the class as they use identifiers without any context to generate their classes. Example:

```html
// Correct
<div class="text:white md(text:red)" />

// WRONG!
<div class="md(text:red) text:white" />
```

### Responsive

`xs | md | lg | xl`

`w:100% md(w:500px)`

### Theme

`dark | light | sepia`

`text:black dark(text:#CCCCCC)`

### Pseudo-Class

`hover | active | focus | link | etc..`

`bg:gray hover(bg:transparent border[2 black solid])`

### Pseudo-Element

`after | before | cue | etc..`

`bg:gray cue(bg:transparent border[2 black solid])`