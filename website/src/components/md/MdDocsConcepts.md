# Concepts

## Nullable

Any identifier and resource set that cannot be resolved (wrong) is treated as null and removed in the final transformation. This model facilitates the handling of errors by the template and asks the user to follow the proposed pattern.

```html
<div class="text:15px" /> -> <div class="text-15px" />

<div class="text:15pxxx" /> -> <div class="" />
```

## Purge Titles

Ununura accepts any character type and transforms whatever is necessary to be compatible with the css specification. For example, you can pass url or path to `background-url` natively:

`bg:/foo.png` /public vite folder

`bg://foo.jpeg` https url (not insert https:)

## Only-Scoped

By default, all classes are generated with a unique sequence of characters being: 

`.<identifier>-<line-start>-<filename>(-...<resources>)`

```html
<div class="flex[h-center v-center]" /> -> <div class="flex-1-appvue-h-center-v-center" />
```

This model was adopted to avoid selector conflicts (mainly @media), being scoped by default (and using native scoped tools depending on the SFC, as in (.vue|.svelte) files).

### JSX-All-Scoped

As in some frameworks we don't have something similar to the `<style>` or `<style scoped>` tag (or a build-in alternative of the framework itself for scoped), the css generated for JSX consists of encompassing it entirely in a single file (ununura.css) using the advantage of titles unique described earlier.
