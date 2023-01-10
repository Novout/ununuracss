import { purgeCSS, purgeOnlyCssClassTitle } from "packages/engine/src/purge";
import { getSupportedInteger } from "packages/engine/src/support";
import { lex, classesFromRawHtml, resolveTitleCssClass, resolveCSS, generateUniqueClass, generateMultipleClass, generateCSSResources, scan, UnunuraGenerate, resolveIdentifierInCSS } from "ununura-engine";
import { isKey, NULLABLE, UnunuraIdentifier, ANTIALIASED_RESET_CSS } from "ununura-shared";
import { describe, expect, it } from "vitest";

describe('lexer', () => {
  it('should lex a css class', () => {
    const targets = [
      [
        lex('bg:#909090 m[0 0 10 0] border:10 text:10'), 
        [
          "bg",
          ":",
          "#909090",
          "m",
          "[",
          "0 0 10 0",
          "]",
          "border",
          ":",
          "10",
          "text",
          ":",
          "10"
        ]
      ],
      [
        lex('border[5 yellow]'),
        [
          "border",
          "[",
          "5 yellow",
          "]"
        ]
      ],
      [
        lex('text[white 500 2] m[0 0 10 0] p:10'), 
        [
          "text",
          "[",
          "white 500 2",
          "]",
          "m",
          "[",
          "0 0 10 0",
          "]",
          "p",
          ":",
          "10"
        ]
      ],
      [
        lex('bg:white m[0 0 10 0] p:10'), 
        [
          "bg",
          ":",
          "white",
          "m",
          "[",
          "0 0 10 0",
          "]",
          "p",
          ":",
          "10"
        ]
      ],
      [
        lex('text:roboto text[white xl 900] border[2 #050505 dashed rounded]'), 
        [
          "text",
          ":",
          "roboto",
          "text",
          "[",
          "white xl 900",
          "]",
          "border",
          "[",
          "2 #050505 dashed rounded",
          "]"
        ]
      ],
      [
        lex('external-class foo bar baz border[5 yellow] foo bar baz'),
        [
          "border",
          "[",
          "5 yellow",
          "]"
        ]
      ],
      [
        lex('external-class foo p:10 bar baz border[5 yellow] foo bar baz'),
        [
          "p",
          ":",
          "10",
          "border",
          "[",
          "5 yellow",
          "]"
        ]
      ],
      [
        lex('bar baz border[5 yellow] external-class foo'),
        [
          "border",
          "[",
          "5 yellow",
          "]"
        ]
      ],
      [
        lex('bg://i.imgur.com/XyZvY.png'),
        [
          "bg",
          ":",
          "//i.imgur.com/XyZvY.png"
        ]
      ],
      [
        lex('bg:white md(m[0 0 10 0] p:10) dark(text:white bg:black)'), 
        [
          "bg",
          ":",
          "white",
          "md",
          "(",
          "m",
          "[",
          "0 0 10 0",
          "]",
          "p",
          ":",
          "10",
          ")",
          "dark",
          "(",
          "text",
          ":",
          "white",
          "bg",
          ":",
          "black",
          ")"
        ]
      ],
      [
        lex('bg:white text:black dark(md(m[0 0 10 0] p:10) text:white bg:black)'), 
        [
          "bg",
          ":",
          "white",
          "text",
          ":",
          "black",
          "dark",
          "(",
          "md",
          "(",
          "m",
          "[",
          "0 0 10 0",
          "]",
          "p",
          ":",
          "10",
          ")",
          "text",
          ":",
          "white",
          "bg",
          ":",
          "black",
          ")"
        ]
      ],
    ]
  
    for (const [lex, result] of targets) {
      expect(lex).toStrictEqual(result)
    }
  })  

  it('should not get a key', () => {
    expect(isKey(' ')).toBeFalsy()
  })
  
  it('should get a key', () => {
    [':', '(', ')', '[', ']'].forEach(key => expect(isKey(key)).toBeTruthy())
  })
})

describe('html', () => {
  it('should get a classes from raw html', () => {
    const targets = [
      [
        classesFromRawHtml(''),
        []
      ],
      [
        classesFromRawHtml('<div>some div</div>'),
        []
      ],
      [
        classesFromRawHtml('<div class="bg:white text[white 700]" />'),
        ['bg:white text[white 700]']
      ],
      [
        classesFromRawHtml('<div id="1" class="bg:white text[white 700]" />'),
        ['bg:white text[white 700]']
      ],
      [
        classesFromRawHtml('<div :style={ backgroundColor: "white" } class="text[white 700]" />'),
        ['text[white 700]']
      ],
      [
        classesFromRawHtml('<div :style={ backgroundColor: "white" } class="text[white 700]">some text</div><div class="border[top 2 black]" />'),
        ['text[white 700]', 'border[top 2 black]']
      ],
    ]

    for (const [raw, result] of targets) {
      expect(raw).toStrictEqual(result)
    }
  })
})

describe('transform', () => {
  it('should get css class', () => {
    const targets = [
      [
        resolveCSS(UnunuraIdentifier.Padding, { contents: ['2'], buffer: [], stack: [] }),
        `.p-2 {
  padding: 2px;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Padding, { contents: ['2', '5'], buffer: [], stack: [] }),
        `.p-2-5 {
  padding: 2px 5px;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Padding, { contents: ['2', '5rem', '0', '10rem'], buffer: [], stack: [] }),
        `.p-2-5rem-0-10rem {
  padding: 2px 5rem 0px 10rem;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Padding, { contents: ['0.25'], buffer: [], stack: [] }),
        `.p-025 {
  padding: 0.25px;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Margin, { contents: ['2'], buffer: [], stack: [] }),
        `.m-2 {
  margin: 2px;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Margin, { contents: ['2', '5'], buffer: [], stack: [] }),
        `.m-2-5 {
  margin: 2px 5px;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Margin, { contents: ['2', '5', '0', '10'], buffer: [], stack: [] }),
        `.m-2-5-0-10 {
  margin: 2px 5px 0px 10px;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Margin, { contents: ['0.25'], buffer: [], stack: [] }),
        `.m-025 {
  margin: 0.25px;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Margin, { contents: ['50%', '25ch'], buffer: [], stack: [] }),
        `.m-50-25ch {
  margin: 50% 25ch;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Margin, { contents: ['!', '50%', '25ch'], buffer: [], stack: [] }),
        `.m-_important_-50-25ch {
  margin: 50% 25ch !important;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Border, { contents: ['white', '2', 'solid'], buffer: [], stack: [] }),
        `.border-white-2-solid {
  border: solid;
  border-color: white;
  border-width: 2px;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Border, { contents: ['2'], buffer: [], stack: [] }),
        `.border-2 {
  border-width: 2px;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Border, { contents: ['dashed', 'black'], buffer: [], stack: [] }),
        `.border-dashed-black {
  border: dashed;
  border-color: black;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Border, { contents: ['10', 'dashed', 'black'], buffer: [], stack: [] }),
        `.border-10-dashed-black {
  border: dashed;
  border-color: black;
  border-width: 10px;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Text, { contents: ['2rem', 'black'], buffer: [], stack: [] }),
        `.text-2rem-black {
  color: black;
  font-size: 2rem;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Text, { contents: ['2rem'], buffer: [], stack: [] }),
        `.text-2rem {
  font-size: 2rem;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Text, { contents: ['arial'], buffer: [], stack: [] }),
        `.text-arial {
  font-family: 'Arial', sans-serif;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Text, { contents: ['roboto'], buffer: [], stack: [] }),
        `.text-roboto {
  font-family: 'Roboto', sans-serif;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Background, { contents: ['#000000'], buffer: [], stack: [] }),
        `.bg-000000 {
  background-color: #000000;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Background, { contents: ['#000000'], buffer: [], stack: ['dark'] }),
        `.dark .bg-000000-dark {
  background-color: #000000;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Background, { contents: ['rgb-255-255-255'], buffer: [], stack: [] }),
        `.bg-rgb-255-255-255 {
  background-color: rgb(255, 255, 255);
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Background, { contents: ['rgba-255-255-255-0.5'], buffer: [], stack: [] }),
        `.bg-rgba-255-255-255-05 {
  background-color: rgba(255, 255, 255, 0.5);
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Background, { contents: ['hsl-0-100%-50%'], buffer: [], stack: [] }),
        `.bg-hsl-0-100-50 {
  background-color: hsl(0, 100%, 50%);
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Background, { contents: ['hsla-0-100%-50%-0.5'], buffer: [], stack: [] }),
        `.bg-hsla-0-100-50-05 {
  background-color: hsla(0, 100%, 50%, 0.5);
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Background, { contents: ['--primary-color'], buffer: [], stack: [] }),
        `.bg---primary-color {
  background-color: var(--primary-color);
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Background, { contents: ['#000001', 'cover'], buffer: [], stack: [] }),
        `.bg-000001-cover {
  background-color: #000001;
  background-size: cover;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Background, { contents: ['/test.png'], buffer: [], stack: [] }),
        `.bg-testpng {
  background-image: url("/test.png");
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Background, { contents: ['/foo.png', 'auto'], buffer: [], stack: [] }),
        `.bg-foopng-auto {
  background-image: url("/foo.png");
  background-size: auto;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Background, { contents: ['transparent'], buffer: [], stack: [] }),
        `.bg-transparent {
  background-color: transparent;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Flexbox, { contents: ['row', 'grow'], buffer: [], stack: [] }),
        `.flex-row-grow {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Flexbox, { contents: ['row', 'v-center', 'h-center'], buffer: [], stack: [] }),
        `.flex-row-v-center-h-center {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Flexbox, { contents: ['row', 'v-stretch', 'h-flex-start'], buffer: [], stack: [] }),
        `.flex-row-v-stretch-h-flex-start {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Flexbox, { contents: ['col-reverse', 'grow-none'], buffer: [], stack: [] }),
        `.flex-col-reverse-grow-none {
  display: flex;
  flex-direction: column-reverse;
  flex-grow: 0;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Flexbox, { contents: ['col-reverse', 'grow-none', 'gap-2rem'], buffer: [], stack: [] }),
        `.flex-col-reverse-grow-none-gap-2rem {
  display: flex;
  flex-direction: column-reverse;
  flex-grow: 0;
  gap: 2rem;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Flexbox, { contents: ['wrap'], buffer: [], stack: [] }),
        `.flex-wrap {
  display: flex;
  flex-wrap: wrap;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Flexbox, { contents: ['nowrap'], buffer: [], stack: [] }),
        `.flex-nowrap {
  display: flex;
  flex-wrap: nowrap;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Flexbox, { contents: ['wrap-reverse'], buffer: [], stack: [] }),
        `.flex-wrap-reverse {
  display: flex;
  flex-wrap: wrap-reverse;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Flexbox, { contents: ['?', 'flex-1'], buffer: [], stack: [] }),
        `.flex-_none_-flex-1 {
  flex: 1 1 0%;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Flexbox, { contents: ['flex-1'], buffer: [], stack: [] }),
        `.flex-flex-1 {
  display: flex;
  flex: 1 1 0%;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Width, { contents: ['100%'], buffer: [], stack: [] }),
        `.w-100 {
  width: 100%;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Width, { contents: ['max', '50vw'], buffer: [], stack: [] }),
        `.w-max-50vw {
  max-width: 50vw;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Width, { contents: ['100dvw'], buffer: [], stack: [] }),
        `.w-100dvw {
  width: 100dvw;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Height, { contents: ['300'], buffer: [], stack: [] }),
        `.h-300 {
  height: 300px;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Height, { contents: ['300px'], buffer: [], stack: [] }),
        `.h-300px {
  height: 300px;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Height, { contents: ['min', '100vh'], buffer: [], stack: [] }),
        `.h-min-100vh {
  min-height: 100vh;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Height, { contents: ['max', '10rem'], buffer: [], stack: [] }),
        `.h-max-10rem {
  max-height: 10rem;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Position, { contents: ['absolute'], buffer: [], stack: [] }),
        `.pos-absolute {
  position: absolute;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Position, { contents: ['sticky', 'left-2rem'], buffer: [], stack: [] }),
        `.pos-sticky-left-2rem {
  position: sticky;
  left: 2rem;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Position, { contents: ['relative', 'right-0'], buffer: [], stack: [] }),
        `.pos-relative-right-0 {
  position: relative;
  right: 0;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Position, { contents: ['!', 'sticky', 'left-2rem'], buffer: [], stack: [] }),
        `.pos-_important_-sticky-left-2rem {
  position: sticky !important;
  left: 2rem !important;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Scroll, { contents: ['hidden'], buffer: [], stack: [] }),
        `.scroll-hidden {
  overflow: hidden;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Scroll, { contents: ['x', 'auto'], buffer: [], stack: [] }),
        `.scroll-x-auto {
  overflow-x: auto;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Scroll, { contents: ['y', 'visible'], buffer: [], stack: [] }),
        `.scroll-y-visible {
  overflow-y: visible;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Scroll, { contents: [], buffer: [], stack: [] }),
        `.scroll {
  overflow: scroll;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Scroll, { contents: ['x'], buffer: [], stack: [] }),
        `.scroll-x {
  overflow-x: scroll;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Cursor, { contents: ['pointer'], buffer: [], stack: [] }),
        `.cursor-pointer {
  cursor: pointer;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Cursor, { contents: ['none'], buffer: [], stack: [] }),
        `.cursor-none {
  cursor: none;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Float, { contents: ['right'], buffer: [], stack: [] }),
        `.float-right {
  float: right;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.ZIndex, { contents: ['5'], buffer: [], stack: [] }),
        `.z-5 {
  z-index: 5;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Display, { contents: ['none'], buffer: [], stack: [] }),
        `.display-none {
  display: none;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Rounded, { contents: ['1rem'], buffer: [], stack: [] }),
        `.rounded-1rem {
  border-radius: 1rem;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Rounded, { contents: ['25px', '2rem'], buffer: [], stack: [] }),
        `.rounded-25px-2rem {
  border-radius: 25px 2rem;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Rounded, { contents: ['25px', '2rem'], buffer: [], stack: ['xl'] }),
        `@media (min-width: 1536px) {
.rounded-25px-2rem {
  border-radius: 25px 2rem;
}
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Shadow, { contents: ['black'], buffer: [], stack: [] }),
        `.shadow-black {
  box-shadow: 5px 5px 5px 0px black;
  -webkit-box-shadow: 5px 5px 5px 0px black;
  -moz-box-shadow: 5px 5px 5px 0px black;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Shadow, { contents: ['h-10', 'v-10'], buffer: [], stack: [] }),
        `.shadow-h-10-v-10 {
  box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.5);
  -webkit-box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.5);
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Shadow, { contents: ['inset', 'h-10', 'v-10'], buffer: [], stack: [] }),
        `.shadow-inset-h-10-v-10 {
  box-shadow: inset 10px 10px 5px 0px rgba(0, 0, 0, 0.5);
  -webkit-box-shadow: inset 10px 10px 5px 0px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: inset 10px 10px 5px 0px rgba(0, 0, 0, 0.5);
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Reset, { contents: ['antialiased'], buffer: [], stack: [] }),
        `* {
${ANTIALIASED_RESET_CSS()}}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Reset, { contents: ['meyer'], buffer: [], stack: [] }),
        `/* http://meyerweb.com/eric/tools/css/reset/ 
  v2.0 | 20110126
  License: none (public domain)
*/

html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
`
      ],
      [
        resolveCSS(UnunuraIdentifier.Reset, { contents: ['novout'], buffer: [], stack: [] }),
        `* {
  padding: 0;
  margin: 0;
  outline: 0;
  font-size: 16px;
  ${ANTIALIASED_RESET_CSS()}
}

[contenteditable] {
  outline: none;
  -moz-user-select: text;
  -webkit-tap-highlight-color: transparent;
}  
`
      ],
      [
        resolveCSS(UnunuraIdentifier.Margin, { contents: ['2', '10', '5'], buffer: [], stack: [] }),
        NULLABLE
      ],
      [
        resolveCSS(UnunuraIdentifier.Padding, { contents: ['2', '10', '5'], buffer: [], stack: [] }),
        NULLABLE
      ],
      [
        resolveCSS('wrong' as any, { contents: ['foo', 'baz', 'bar'], buffer: [], stack: [] }),
        NULLABLE
      ],
    ]

    for (const [cl, result] of targets) {
      expect(cl).toStrictEqual(result)
    }
  })

  it('should get css class in theme context', () => {
    const targets = [
      [
        resolveCSS(UnunuraIdentifier.Cursor, { contents: ['none'], buffer: [], stack: ['dark'] }),
        `.dark .cursor-none-dark {
  cursor: none;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Padding, { contents: ['5rem'], buffer: [], stack: ['sepia'] }),
        `.sepia .p-5rem-sepia {
  padding: 5rem;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Rounded, { contents: ['2rem'], buffer: [], stack: ['light'] }),
        `.light .rounded-2rem-light {
  border-radius: 2rem;
}`
      ],
    ]

    for (const [css, result] of targets) {
      expect(css).toStrictEqual(result)
    }
  })

  it('should generate correct classes from raw context', () => {
    const targets = [
      [
        generateUniqueClass(['m','10'], { contents: [], buffer: [], stack: [] }), `.m-10 {
  margin: 10px;
}`
      ],
      [
        generateMultipleClass(['m', '0 10 0 0'], { contents: [], buffer: [], stack: [] }), `.m-0-10-0-0 {
  margin: 0px 10px 0px 0px;
}`
      ],
    ]

    for (const [css, result] of targets) {
      expect(css).toStrictEqual(result)
    }
  })
})

describe('css', () => {
  it('should get a resources from raw html', () => {
    const targets = [
  [
    generateCSSResources(`<div class="p:10 bg:black">
  <div class="border[white]" />
</div>
`),
        `.p-10 {
  padding: 10px;
}
.bg-black {
  background-color: black;
}
.border-white {
  border-color: white;
}
`],
  [
    generateCSSResources(`<div class="bg:/local_image.png" />
  `),
        `.bg-local-imagepng {
  background-image: url("/local_image.png");
}
`],
  [
    generateCSSResources(`<div class="md(bg:/local_image.png) bg:/other_image.png" />
  `),
  `@media (min-width: 768px) {
.bg-local-imagepng {
  background-image: url("/local_image.png");
}
}
.bg-other-imagepng {
  background-image: url("/other_image.png");
}
`],
  [resolveIdentifierInCSS(UnunuraIdentifier.Text), 'font'],
  [resolveIdentifierInCSS(UnunuraIdentifier.Flexbox), 'flex'],
  [resolveTitleCssClass(UnunuraIdentifier.Margin, { contents: ['15', '0', '10', '0'], buffer: [], stack: [] }), '.m-15-0-10-0'],
  [resolveTitleCssClass(UnunuraIdentifier.Flexbox, { contents: ['flex-1'], buffer: [], stack: [] }), '.flex-flex-1'],
  [resolveTitleCssClass(UnunuraIdentifier.Background, { contents: ['rgba-255-255-255-0.3)'], buffer: [], stack: [] }), '.bg-rgba-255-255-255-03'],
  [resolveTitleCssClass(UnunuraIdentifier.Background, { contents: ['#FF0000'], buffer: [], stack: [] }), '.bg-ff0000'],
  [resolveTitleCssClass(UnunuraIdentifier.Background, { contents: ['/local_image.png'], buffer: [], stack: [] }), '.bg-local-imagepng']
]

    for (const [raw, result] of targets) {
      expect(raw).toStrictEqual(result)
    }
  })
})

describe('purge', () => {
  it('should purge or not css generated files', () => {
    const targets = [
      [purgeCSS(`.bg-#000000 {
  background-color: #000000;
}
.p-10 {
  padding: 10px;
}
.bg-#000000 {
  background-color: #000000;
}`), `.bg-#000000 {
  background-color: #000000;
}
.p-10 {
  padding: 10px;
}`],
  [purgeCSS(`.bg-#000000 {
  background-color: #000000;
}
.p-35 {
  padding: 35px;
}`), `.bg-#000000 {
  background-color: #000000;
}
.p-35 {
  padding: 35px;
}`], [purgeCSS(`a wrong css file`), `.
a wrong css file`], [purgeOnlyCssClassTitle(`.text-base {
  font-size: 1rem;
}`), 'text-base'],
  [purgeOnlyCssClassTitle(`.border-white {
    border-color: white;
  }`), 'border-white']
    ]

    for (const [raw, result] of targets) {
      expect(raw).toStrictEqual(result)
    }
  })
})

describe('support', () => {
  it('should get correct value', () => {
    const targets = [
      [getSupportedInteger(['400']), '400'],
      [getSupportedInteger(['xyz']), NULLABLE],
    ]

    for (const [raw, result] of targets) {
      expect(raw).toStrictEqual(result)
    }
  })
})

describe('fs', () => {
  it('should ignore files', async () => {
    const targets = [
      [scan({ include: ['**/*.xyz'], exclude: [] }), []],
      [UnunuraGenerate({ include: ['**/*.xyz'], exclude: [] }), ''],
    ]

    for (const [raw, result] of targets) {
      expect(await raw).toStrictEqual(result)
    }
  })
})