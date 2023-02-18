# Why?

Seeing how [UnoCSS](https://github.com/unocss/unocss) was built, the idea came up ​​building an engine without presets that automatically understands the needs of the application complete context. **Ununura** is a CSS Engine with the aim of providing greater readability and scalability by offering total decoupling of internal methods and easy adaptation for existing applications.

## A Real Engine

**UnunuraCSS** was designed with the intention of offering a syntax more related to the CSS specification itself than proper names, where developers need to **understand only about CSS** and **not decorate identifiers and resources**. For example, the following specification is converted from:

```html
class="text[arial #CC0000 1.2rem 700]"
```

to: 

```css
.text-arial-cc0000-12rem-700 {
  color: #CC0000;
  font-size: 1.2rem;
  font-weight: 700;
  font-family: 'Arial', sans-serif;
}
```

Therefore, we are able to offer better code maintenance practices and interface constructions, **not having the need to learn the framework**.

### Dynamic Titles

Identifiers accepts any character type and transforms whatever is necessary to be compatible with the css specification. For example, you can pass url or path to `background-url` natively:

`bg:/foo.png` /public vite folder

`bg://foo.jpeg` https url (not insert https:)

## Only-Scoped

Some frameworks generate unique CSS for each SFC (Single File Component) file, that is, within a scope. This methodology allows working with class titles separately and that do not interfere with any other component of the application. Therefore, the idea of ​​every class built by the engine being unique, scoped not by file, but by the line of the class. By default, these classes are generated with a unique sequence of characters being: 

`.<identifier>-<line-start>-<filename>(-...<resources>)`

```html
<div class="flex:col" /> -> <div class="flex-1-app-col" />
```

This model was adopted to avoid selector conflicts (mainly @media), being scoped by default (and using native scoped tools depending on the SFC, as in (.vue|.svelte) files).

### JSX-All-Scoped

As in some frameworks we don't have something similar to the `<style>` or `<style scoped>` tag (or a build-in alternative of the framework itself for scoped), the css generated for JSX consists of encompassing it entirely in a single file (ununura.css) using the advantage of titles unique described earlier.