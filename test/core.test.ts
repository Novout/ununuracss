import { getSupportedSizer } from "packages/core/src/support";
import { lex, classesFromRawHtml, resolveTitleCssClass, resolveCSS, generateUniqueClass, generateMultipleClass, generateCSSResources, scan, UnunuraGenerate, resolveOnlyCssClassTitle } from "ununura-core";
import { isKey, NULLABLE, UnunuraIdentifier } from "ununura-shared";
import { describe, expect, it } from "vitest";

describe('lexer', () => {
  it('should lex a css class', () => {
    const targets = [
      [
        lex('bg:#909090 m[0 0 10 0] border:10 text:lg'), 
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
          "lg"
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
        lex('text[white lg bold] m[0 0 10 0] p:10'), 
        [
          "text",
          "[",
          "white lg bold",
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
        lex('bg:white m[0 0 10 0] !p:10'), 
        [
          "bg",
          ":",
          "white",
          "m",
          "[",
          "0 0 10 0",
          "]",
          "!",
          "p",
          ":",
          "10"
        ]
      ],
      [
        lex('text:roboto text[white xl bold] border[2 #050505 dashed rounded]'), 
        [
          "text",
          ":",
          "roboto",
          "text",
          "[",
          "white xl bold",
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
    ]
  
    for (const [lex, result] of targets) {
      expect(lex).toStrictEqual(result)
    }
  })  

  it('should not get a key', () => {
    expect(isKey(' ')).toBeFalsy()
  })
  
  it('should get a key', () => {
    [':', '(', ')', '[', ']', '!'].forEach(key => expect(isKey(key)).toBeTruthy())
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
        classesFromRawHtml('<div class="bg:white text[white bold]" />'),
        ['bg:white text[white bold]']
      ],
      [
        classesFromRawHtml('<div id="1" class="bg:white text[white bold]" />'),
        ['bg:white text[white bold]']
      ],
      [
        classesFromRawHtml('<div :style={ backgroundColor: "white" } class="text[white bold]" />'),
        ['text[white bold]']
      ],
      [
        classesFromRawHtml('<div :style={ backgroundColor: "white" } class="text[white bold]">some text</div><div class="border[top 2 black]" />'),
        ['text[white bold]', 'border[top 2 black]']
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
        resolveCSS(UnunuraIdentifier.Padding, ['2', '5', '0', '10']),
        `.p-2-5-0-10 {
  padding: 2px 5px 0px 10px;
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
        resolveCSS(UnunuraIdentifier.Border, ['10', 'dashed', 'black', 'rounded-4']),
        `.border-10-dashed-black-rounded-4 {
  border: dashed;
  border-color: black;
  border-width: 10px;
  border-radius: 4px;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Text, ['lg', 'black']),
        `.text-lg-black {
  color: black;
  font-size: 1.125rem;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Text, ['l-spacing-20']),
        `.text-l-spacing-20 {
  letter-spacing: 20px;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Text, ['lg', 'indent-5', 'l-spacing-10', 'w-spacing-5']),
        `.text-lg-indent-5-l-spacing-10-w-spacing-5 {
  font-size: 1.125rem;
  letter-indent: 5px;
  letter-spacing: 10px;
  word-spacing: 5px;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Text, ['arial', 'indent-5']),
        `.text-arial-indent-5 {
  font-family: 'Arial', sans-serif;
  letter-indent: 5px;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Background, ['#000000']),
        `.bg-#000000 {
  background-color: #000000;
}`
      ],
      [
        resolveCSS(UnunuraIdentifier.Background, ['#000001', 'cover']),
        `.bg-#000001-cover {
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
        resolveCSS(UnunuraIdentifier.Flexbox, ['row', 'grow']),
        `.flex-row-grow {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
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
        resolveCSS(UnunuraIdentifier.Flexbox, ['flex-1', 'none']),
        `.flex-flex-1-none {
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
    generateCSSResources(`<div class="bg:local_image.png" />
  `),
        `.bg-local-imagepng {
  background-image: url("local_image.png");
}
`],
  [resolveTitleCssClass(UnunuraIdentifier.Margin, ['15', '0', '10', '0']), '.m-15-0-10-0'],
  [resolveTitleCssClass(UnunuraIdentifier.Text, ['lg']), '.text-lg'],
  [resolveTitleCssClass(UnunuraIdentifier.Flexbox, ['flex-1']), '.flex-flex-1'],
  [resolveTitleCssClass(UnunuraIdentifier.Background, ['rgba(255,255,255,0.3)']), '.bg-rgba255-255-255-03'],
  [resolveTitleCssClass(UnunuraIdentifier.Background, ['/local_image.png']), '.bg-local-imagepng'],
  [resolveOnlyCssClassTitle(`.text-base {
  font-size: 1rem;
}`), 'text-base'],
  [resolveOnlyCssClassTitle(`.border-white-rounded-30 {
    border-color: white;
    border-radius: 30px;
  }`), 'border-white-rounded-30'],
  [getSupportedSizer(['xs', 'sm', 'base', 'lg', 'xl']), '0.75rem'],
  [getSupportedSizer(['sm', 'base', 'lg', 'xl']), '0.875rem'],
  [getSupportedSizer(['base', 'lg', 'xl']), '1rem'],
  [getSupportedSizer(['lg', 'xl']), '1.125rem'],
  [getSupportedSizer(['xl']), '1.25rem']
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