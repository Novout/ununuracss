# Identifiers

Identifiers is keys with one `:` or multiple resources `[]` for transform this in classes with unique and correct CSS titles. Each resource has supporters with the function of search valid CSS concents in range and apply this in specific class.

**Ununura** implements two valid syntaxes:

```
context?(...<identifier>:<resource>)

text:1.5rem

text:1.5rem md(text:1.5rem)
```

or

```
context?(...<identifier>[<...resources>])

text[arial 1.5rem #FF00FF 500]

text[1.5rem 500] dark(text[arial 1.5rem #FF00FF 500] hover(text[roboto 1.5rem rgba-255-255-255.05 500]))
```

### Reserved Names

Identifiers are reserved names that will create a class from the content (resources) passed before a white space. Because they are reserved names, it is recommended not to use external classes with the name of one of the identifiers.

```
// Correct
<div class="foo bar text:white baz" />

// WRONG!
<div class="text-class bar text:white baz" />
```

### Virtual Identifiers

Some identifiers don't create classes, but apply CSS in virtual CSS module (import 'ununura.css'). For example, the reset identifier does not create a class, but rather inserts a bunch of classes globally. Example:

`<div class="reset:meyer" />` -> [Meyer Reset CSS](https://meyerweb.com/eric/tools/css/reset/)

`<div class="reset:novout" />` -> [Ununura Creator Special Reset CSS](https://github.com/Novout/ununuracss/tree/main/packages/shared/src/defines.ts)

## Identifiers List

The following is the list of identifiers and the features supported by each identifier.