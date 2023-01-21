# UnunuraCSS

A different form to interpreter Atomic CSS focused on vite ecosystem.

<div>
  <img src="https://img.shields.io/github/lerna-json/v/Novout/ununuracss?color=ccc&label=version&logoColor=ccc&style=for-the-badge">
  <img src="https://img.shields.io/github/actions/workflow/status/Novout/ununuracss/test.yml?color=%23cccccc&logoColor=%23cccccc&style=for-the-badge">
</div>

## Features

- [Vue](./packages/vite/README.md), [React/Preact/Vue-JSX](./packages/vite/README.md), [Nuxt](./packages/nuxt/README.md) and [Svelte](./packages/vite/README.md);
- 0kb default injected .css;
- Only scoped and native jsx-scoped;
- Class-raw based;
- Native purge;
- [Fontaine](https://github.com/danielroe/fontaine) integrated;
- No directives / presets;
- Dynamic identifiers (rules) with unique/multiple engine;
- Nullable options/classes;
- External contexts (fonts/public files...).

## Motivation

Reading how [UnoCSS](https://github.com/unocss/unocss) was designed, he had the idea of ​​building an engine without presets that automatically understands the needs of the application complete context. 

**ATTENTION!** UnunuraCSS was not designed for medium-large projects that require standardized resources.

## Simple Example

```html
<template>
  <main class="reset:meyer">
    <div class="flex[col h-center v-center] border[2 white solid] p[top 2rem] m[0 10] bg:black w:100% h:100vh">
      <p class="text[arial white 2rem 700]">Hello UnunuraCSS!</p>
    </div>
  </main>
</template>
```

## Use Syntax

### Single Resources

`context?(...<identifier>:<resource>)`

`text:1.5rem`

`text:1.5rem md(text:1.5rem)`

### Multiple Resources

`context?(...<identifier>[<...resources>])`

`text[arial 1.5rem #FF00FF 500]`

`text[1.5rem 500] dark(text[arial 1.5rem #FF00FF 500] hover(text[roboto 1.5rem rgba-255-255-255.05 500]))`

## Identifiers

Identifiers are reserved names that will create a class from the content (resources) passed before a white space. Because they are reserved names, it is recommended `not to use external classes with the name of one of the identifiers`. Find the list of identifiers by [clicking here.](./packages/shared/src/enums.ts)

```html
// Correct
<div class="foo bar text:white baz" />

// WRONG!
<div class="text-class bar text:white baz" />
```

### Reset

The `reset` identifier does not create a class, but rather inserts a bunch of classes globally. Example:

`<div class="reset:meyer" />` -> [Meyer Reset CSS](https://meyerweb.com/eric/tools/css/reset/)

`<div class="reset:novout" />` -> [Ununura Creator Reset CSS](./packages/shared/src/defines.ts)

## Resources

Resources are generic names that will be resolved by identifier given the need or existence of validation. If the resource is not valid for the identifier in question, the resource will be ignored.

### Supporters

Each identifier handles, through the supports, a way of interpreting what is described in a unique and simple way. For example, you can pass the color to an identifier in several ways:

`text:yellow` CSS Default Colors

`text:#FF0000` HEX

`text:rgb-255-255-255` RGB

`text:rgba-255-255-255-0.5` RGBA

`text:hsl-30%-0-60%` HSL

`text:hsla-30%-0-60%-0.5` HSLA

`text:--primary-color` CSS Variables

`text:transparent` Transparent

### Globals

Any resource can receive `globals`, generic resources that interfere with identifier resolution

- ! Important: Applies `!important` in all resources

`text[! red]` -> `color: red !important;`

- ? None: Remove all implicit resources from identifier

`flex[? flex-1]` -> Removes `display: flex;`

### Nullable

Any identifier and resource set that cannot be resolved (wrong) is treated as null and removed in the final transformation. This model facilitates the handling of errors by the template and asks the user to follow the proposed pattern.

```html
<div class="text:15px" /> -> <div class="text-15px" />

<div class="text:15pxxx" /> -> <div class="" />
```

### Purge Titles

Ununura accepts any character type and transforms whatever is necessary to be compatible with the css specification. For example, you can pass url or path to `background-url` natively:

`bg:/foo.png` /public vite folder

`bg://foo.jpeg` https url (not insert https:)

## Context

Context is way for applying context without directly interfering with what is resolved by identifiers, suffixing or prefixing the class as needed. For example, the context `dark` will always apply `.dark .resolved-class-here`, regardless of the created class. Contexts are treated internally as a stack and only the first case found of specific context type is considered (i.e. md(xl(class-here)) will be considered as just md(class-here) because md and xl are part of the same context (responsiveness)).

> ATTENTION! Globals need to be last in the class as they use identifiers without any context to generate their classes. Example:

```html
// Correct
<div class="cursor:pointer md(cursor:none)" />

// WRONG!
<div class="md(cursor:none) cursor:pointer" />
```

### Responsive

`xs | md | lg | xl`

`w:100% md(w:500px)`

### Theme

`dark | light | sepia`

`text:black dark(text:#CCCCCC)`

### Pseudo-Class

`hover | active | focus | link | etc..`

`bg:gray hover(bg:none border[2 black solid])`

### Pseudo-Element

`after | before | cue | etc..`

`bg:gray cue(bg:none border[2 black solid])`

## Only-Scoped

By default, all classes are generated with a unique sequence of characters being: 

`.<identifier>-<line-start>-<filename>(-...<resources>)`

```html
<div class="flex[h-center v-center]" /> -> <div class="flex-1-appvue-h-center-v-center" />
```

This model was adopted to avoid selector conflicts (mainly @media), being scoped by default (and using native scoped tools depending on the SFC, as in (.vue|.svelte) files).

### JSX-All-Scoped

As in some frameworks we don't have something similar to the `<style>` or `<style scoped>` tag (or a build-in alternative of the framework itself for scoped), the css generated for JSX consists of encompassing it entirely in a single file (ununura.css) using the advantage of titles unique described earlier.

## Options

The options are inserted by the Vite Ununura plugin.

### Defines

Shorten classes using a single key, for example:

```ts
ununura({
  defines: [
    ['btn', 'cursor:pointer p[1rem 2.5rem] bg:purple text:white']
  ]
})
```