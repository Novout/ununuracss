# Supporters

Some resources have supporters to be interpreted correctly (and validated if necessary. Below, explore the supporters and some of their applications. Some supporters can be extended from the `extend` option.

### Colors

`text:yellow` CSS Default Colors

`text:#FF0000` HEX

`text:rgb-255-255-255` RGB

`text:rgba-255-255-255-0.5` RGBA

`text:hsl-30%-0-60%` HSL

`text:hsla-30%-0-60%-0.5` HSLA

`text:--primary-color` CSS Variables

`text:transparent` Transparent

### Units

This supporter is based on [CSS Units](https://www.w3schools.com/cssref/css_units.php).

`text:18px`

`flex[gap-1rem]`

### Fonts

`font:arial` // Standard browser's font

`font:roboto` // Custom fonts with `extend` option

### FontWeight

`text:200`

`200 -> light`

`500 -> normal`

`700 -> bold`

### Image

`bg:/foo.png` /public vite folder

`bg://imgur.i/foo.jpeg` https url (not insert https:)

### In-Start

This supporter considers the value on the left as the resource key and the value on the right as what will be inserted into the CSS. 

`<key>-<insert>`'

The entered value can also be appended with an extra supporter. For example:

`typo:indent-1rem`

### Unique

A unique value that is interpreted in ways specified by each identifier. For Example:

`typo[center]`

### Sequential

Some identifiers have resources in a specific order and may or may not be appended with other supporters in each phase. For example:

`gradient[0deg rgba-255-255-255-0.2 0% rgba-255-255-255-0.8 100%]`