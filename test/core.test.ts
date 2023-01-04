import { purgeCSS, purgeOnlyCssClassTitle } from "packages/core/src/purge";
import { getSupportedInteger } from "packages/core/src/support";
import { lex, classesFromRawHtml, resolveTitleCssClass, resolveCSS, generateUniqueClass, generateMultipleClass, generateCSSResources, scan, UnunuraGenerate, resolveIdentifierInCSS } from "ununura-core";
import { isKey, NULLABLE, UnunuraIdentifier, ANTIALISED_RESET_CSS } from "ununura-shared";
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
        resolveCSS(UnunuraIdentifier.Padding, ['2']),
        `.p-2 {
  padding: 2px;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Padding, ['2', '5']),
        `.p-2-5 {
  padding: 2px 5px;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Padding, ['2', '5rem', '0', '10rem']),
        `.p-2-5rem-0-10rem {
  padding: 2px 5rem 0px 10rem;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Padding, ['0.25']),
        `.p-025 {
  padding: 0.25px;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Margin, ['2']),
        `.m-2 {
  margin: 2px;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Margin, ['2', '5']),
        `.m-2-5 {
  margin: 2px 5px;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Margin, ['2', '5', '0', '10']),
        `.m-2-5-0-10 {
  margin: 2px 5px 0px 10px;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Margin, ['0.25']),
        `.m-025 {
  margin: 0.25px;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Margin, ['50%', '25ch']),
        `.m-50-25ch {
  margin: 50% 25ch;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Margin, ['!', '50%', '25ch']),
        `.m-_important_-50-25ch {
  margin: 50% 25ch !important;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Border, ['white', '2', 'solid']),
        `.border-white-2-solid {
  border: solid;
  border-color: white;
  border-width: 2px;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Border, ['2']),
        `.border-2 {
  border-width: 2px;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Border, ['dashed', 'black']),
        `.border-dashed-black {
  border: dashed;
  border-color: black;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Border, ['10', 'dashed', 'black']),
        `.border-10-dashed-black {
  border: dashed;
  border-color: black;
  border-width: 10px;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Text, ['2rem', 'black']),
        `.text-2rem-black {
  color: black;
  font-size: 2rem;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Text, ['2rem']),
        `.text-2rem {
  font-size: 2rem;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Text, ['arial']),
        `.text-arial {
  font-family: 'Arial', sans-serif;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Background, ['#000000']),
        `.bg-000000 {
  background-color: #000000;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Background, ['#000001', 'cover']),
        `.bg-000001-cover {
  background-color: #000001;
  background-size: cover;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Background, ['/test.png']),
        `.bg-testpng {
  background-image: url("/test.png");
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Background, ['/foo.png', 'auto']),
        `.bg-foopng-auto {
  background-image: url("/foo.png");
  background-size: auto;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Background, ['https://foo/bar.png']),
        `.bg-httpsfoobarpng {
  background-image: url("https://foo/bar.png");
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Flexbox, ['row', 'grow']),
        `.flex-row-grow {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Flexbox, ['row', 'v-center', 'h-center']),
        `.flex-row-v-center-h-center {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Flexbox, ['row', 'v-stretch', 'h-flex-start']),
        `.flex-row-v-stretch-h-flex-start {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Flexbox, ['col-reverse', 'grow-none']),
        `.flex-col-reverse-grow-none {
  display: flex;
  flex-direction: column-reverse;
  flex-grow: 0;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Flexbox, ['col-reverse', 'grow-none', 'gap-2rem']),
        `.flex-col-reverse-grow-none-gap-2rem {
  display: flex;
  flex-direction: column-reverse;
  flex-grow: 0;
  gap: 2rem;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Flexbox, ['?', 'flex-1']),
        `.flex-_none_-flex-1 {
  flex: 1 1 0%;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Flexbox, ['flex-1']),
        `.flex-flex-1 {
  display: flex;
  flex: 1 1 0%;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Width, ['100%']),
        `.w-100 {
  width: 100%;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Width, ['max', '50vw']),
        `.w-max-50vw {
  max-width: 50vw;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Width, ['100dvw']),
        `.w-100dvw {
  width: 100dvw;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Height, ['300']),
        `.h-300 {
  height: 300px;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Height, ['300px']),
        `.h-300px {
  height: 300px;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Height, ['min', '100vh']),
        `.h-min-100vh {
  min-height: 100vh;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Height, ['max', '10rem']),
        `.h-max-10rem {
  max-height: 10rem;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Position, ['absolute']),
        `.pos-absolute {
  position: absolute;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Position, ['sticky', 'left-2rem']),
        `.pos-sticky-left-2rem {
  position: sticky;
  left: 2rem;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Position, ['relative', 'right-0']),
        `.pos-relative-right-0 {
  position: relative;
  right: 0;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Position, ['!', 'sticky', 'left-2rem']),
        `.pos-_important_-sticky-left-2rem {
  position: sticky !important;
  left: 2rem !important;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Scroll, ['hidden']),
        `.scroll-hidden {
  overflow: hidden;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Scroll, ['x', 'auto']),
        `.scroll-x-auto {
  overflow-x: auto;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Scroll, ['y', 'visible']),
        `.scroll-y-visible {
  overflow-y: visible;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Scroll, []),
        `.scroll {
  overflow: scroll;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Scroll, ['x']),
        `.scroll-x {
  overflow-x: scroll;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Reset, ['novout']),
        `* {
  padding: 0;
  margin: 0;
  outline: 0;
  ${ANTIALISED_RESET_CSS()}
}

#app {
  min-height: 100vh;
  width: 100%;
}

[contenteditable] {
  outline: none;
  -moz-user-select: text;
  -webkit-tap-highlight-color: transparent;
}  
`
      ],
      [
        resolveCSS(UnunuraIdentifier.Margin, ['2', '10', '5']),
        NULLABLE
      ],
      [
        resolveCSS(UnunuraIdentifier.Padding, ['2', '10', '5']),
        NULLABLE
      ],
      [
        resolveCSS('wrong' as any, ['foo', 'bar', 'baz']),
        NULLABLE
      ],
    ]

    for (const [cl, result] of targets) {
      expect(cl).toStrictEqual(result)
    }
  })

  it('should generate correct classes from raw context', () => {
    const targets = [
      [
        generateUniqueClass('m:10'), `.m-10 {
  margin: 10px;
}`
      ],
      [
        generateMultipleClass('m:0 10 0 0'), `.m-0-10-0-0 {
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
  [resolveIdentifierInCSS(UnunuraIdentifier.Text), 'font'],
  [resolveIdentifierInCSS(UnunuraIdentifier.Flexbox), 'flex'],
  [resolveTitleCssClass(UnunuraIdentifier.Margin, ['15', '0', '10', '0']), '.m-15-0-10-0'],
  [resolveTitleCssClass(UnunuraIdentifier.Text, ['lg']), '.text-lg'],
  [resolveTitleCssClass(UnunuraIdentifier.Flexbox, ['flex-1']), '.flex-flex-1'],
  [resolveTitleCssClass(UnunuraIdentifier.Background, ['rgba(255,255,255,0.3)']), '.bg-rgba255-255-255-03'],
  [resolveTitleCssClass(UnunuraIdentifier.Background, ['#FF0000']), '.bg-ff0000'],
  [resolveTitleCssClass(UnunuraIdentifier.Background, ['/local_image.png']), '.bg-local-imagepng']
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