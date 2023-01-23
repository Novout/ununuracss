import { getGlobalReset } from 'packages/engine/src/globals'
import { purgeCSS, purgeOnlyCssClassTitle } from 'packages/engine/src/purge'
import { getSupportedInteger } from 'packages/engine/src/support'
import {
  lex,
  classesFromRawHtml,
  resolveTitleCssClass,
  resolveCSS,
  generateUniqueClass,
  generateMultipleClass,
  scan,
  UnunuraGlobalGenerate,
  resolveIdentifierInCSS,
} from 'ununura-engine'
import { isKey, MEYER_RESET_CSS, NOVOUT_RESET_CSS, NULLABLE, UnunuraIdentifier } from 'ununura-shared'
import { beforeEach, describe, expect, it } from 'vitest'

describe.concurrent('lexer', () => {
  beforeEach(() => {
    Math.random = () => -1
  })

  it('should lex a css class', () => {
    const targets = [
      [
        lex('bg:#909090 m[0 0 10 0] border:10 text:10', {} as any),
        ['bg', ':', '#909090', 'm', '[', '0 0 10 0', ']', 'border', ':', '10', 'text', ':', '10'],
      ],
      [lex('border[5 yellow]', {} as any), ['border', '[', '5 yellow', ']']],
      [
        lex('text[white 500 2] m[0 0 10 0] p:10', {} as any),
        ['text', '[', 'white 500 2', ']', 'm', '[', '0 0 10 0', ']', 'p', ':', '10'],
      ],
      [lex('bg:white m[0 0 10 0] p:10', {} as any), ['bg', ':', 'white', 'm', '[', '0 0 10 0', ']', 'p', ':', '10']],
      [
        lex('text:arial text[white xl 900] border[2 #050505 dashed rounded]', {} as any),
        ['text', ':', 'arial', 'text', '[', 'white xl 900', ']', 'border', '[', '2 #050505 dashed rounded', ']'],
      ],
      [lex('external-class foo bar baz border[5 yellow] foo bar baz', {} as any), ['border', '[', '5 yellow', ']']],
      [
        lex('external-class foo p:10 bar baz border[5 yellow] foo bar baz', {} as any),
        ['p', ':', '10', 'border', '[', '5 yellow', ']'],
      ],
      [lex('bar baz border[5 yellow] external-class foo', {} as any), ['border', '[', '5 yellow', ']']],
      [lex('bg://i.imgur.com/XyZvY.png', {} as any), ['bg', ':', '//i.imgur.com/XyZvY.png']],
      [
        lex('bg:white md(m[0 0 10 0] p:10) dark(text:white bg:black)', {} as any),
        [
          'bg',
          ':',
          'white',
          'md',
          '(',
          'm',
          '[',
          '0 0 10 0',
          ']',
          'p',
          ':',
          '10',
          ')',
          'dark',
          '(',
          'text',
          ':',
          'white',
          'bg',
          ':',
          'black',
          ')',
        ],
      ],
      [
        lex('bg:white text:black dark(md(m[0 0 10 0] p:10) text:white bg:black)', {} as any),
        [
          'bg',
          ':',
          'white',
          'text',
          ':',
          'black',
          'dark',
          '(',
          'md',
          '(',
          'm',
          '[',
          '0 0 10 0',
          ']',
          'p',
          ':',
          '10',
          ')',
          'text',
          ':',
          'white',
          'bg',
          ':',
          'black',
          ')',
        ],
      ],
      [
        lex('md(hover(dark(xl(active(light(xl(focus(sepia(bg:rgba-0-0-0-0.1)))))))))', {} as any),
        [
          'md',
          '(',
          'hover',
          '(',
          'dark',
          '(',
          'xl',
          '(',
          'active',
          '(',
          'light',
          '(',
          'xl',
          '(',
          'focus',
          '(',
          'sepia',
          '(',
          'bg',
          ':',
          'rgba-0-0-0-0.1',
          ')',
          ')',
          ')',
          ')',
          ')',
          ')',
          ')',
          ')',
          ')',
        ],
      ],
    ]

    for (const [lex, result] of targets) {
      expect(lex).toStrictEqual(result)
    }
  })

  it('should lex defines option in css class', () => {
    const targets = [
      [
        lex('btn border:10 text:10', { defines: [['btn', 'style[cursor-pointer] p[1rem 2.5rem]']] } as any),
        ['style', '[', 'cursor-pointer', ']', 'p', '[', '1rem 2.5rem', ']', 'border', ':', '10', 'text', ':', '10'],
      ],
      [lex('btn border:10 text:10', { defines: [] } as any), ['border', ':', '10', 'text', ':', '10']],
      [lex('border:10 text:10', { defines: [] } as any), ['border', ':', '10', 'text', ':', '10']],
      [
        lex('btn other-define', {
          defines: [
            ['btn', 'style[cursor-pointer] p[1rem 2.5rem]'],
            ['other-define', 'border:10 text:10'],
          ],
        } as any),
        ['style', '[', 'cursor-pointer', ']', 'p', '[', '1rem 2.5rem', ']', 'border', ':', '10', 'text', ':', '10'],
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
    ;[':', '(', ')', '[', ']'].forEach((key) => expect(isKey(key)).toBeTruthy())
  })
})

describe.concurrent('html', () => {
  it('should get a classes from raw html', () => {
    const targets = [
      [classesFromRawHtml('').map((node) => node.class), []],
      [classesFromRawHtml('<div>some div</div>').map((node) => node.class), []],
      [classesFromRawHtml('<div class="bg:white text[white 700]" />').map((node) => node.class), ['bg:white text[white 700]']],
      [
        classesFromRawHtml('<div id="1" class="bg:white text[white 700]" />').map((node) => node.class),
        ['bg:white text[white 700]'],
      ],
      [
        classesFromRawHtml('<div :style={ backgroundColor: "white" } class="text[white 700]" />').map((node) => node.class),
        ['text[white 700]'],
      ],
      [
        classesFromRawHtml(
          '<div :style={ backgroundColor: "white" } class="text[white 700]">some text</div><div class="border[top 2 black]" />'
        ).map((node) => node.class),
        ['text[white 700]', 'border[top 2 black]'],
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
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Padding, { contents: ['2', '5'], buffer: [], stack: [] }),
        `.p-2-5 {
  padding: 2px 5px;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Padding, { contents: ['2', '5rem', '0', '10rem'], buffer: [], stack: [] }),
        `.p-2-5rem-0-10rem {
  padding: 2px 5rem 0px 10rem;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Padding, { contents: ['0.25'], buffer: [], stack: [] }),
        `.p-025 {
  padding: 0.25px;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Padding, { contents: ['left', '30px'], buffer: [], stack: [] }),
        `.p-left-30px {
  padding-left: 30px;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Padding, { contents: ['b', '30px'], buffer: [], stack: [] }),
        `.p-b-30px {
  padding-bottom: 30px;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Margin, { contents: ['2'], buffer: [], stack: [] }),
        `.m-2 {
  margin: 2px;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Margin, { contents: ['2', '5'], buffer: [], stack: [] }),
        `.m-2-5 {
  margin: 2px 5px;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Margin, { contents: ['2', '5', '0', '10'], buffer: [], stack: [] }),
        `.m-2-5-0-10 {
  margin: 2px 5px 0px 10px;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Margin, { contents: ['0.25'], buffer: [], stack: [] }),
        `.m-025 {
  margin: 0.25px;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Margin, { contents: ['50%', '25ch'], buffer: [], stack: [] }),
        `.m-50-25ch {
  margin: 50% 25ch;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Margin, { contents: ['top', '2rem'], buffer: [], stack: [] }),
        `.m-top-2rem {
  margin-top: 2rem;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Margin, { contents: ['t', '2rem'], buffer: [], stack: [] }),
        `.m-t-2rem {
  margin-top: 2rem;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Margin, { contents: ['!', '50%', '25ch'], buffer: [], stack: [] }),
        `.m-_important_-50-25ch {
  margin: 50% 25ch !important;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Margin, { contents: ['!', '50%', '25ch'], buffer: [], stack: ['focus'] }),
        `.m-_important_-50-25ch:focus {
  margin: 50% 25ch !important;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Border, { contents: ['white', '2', 'solid'], buffer: [], stack: [] }),
        `.border-white-2-solid {
  border: solid;
  border-color: white;
  border-width: 2px;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Border, { contents: ['2'], buffer: [], stack: [] }),
        `.border-2 {
  border-width: 2px;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Border, { contents: ['t', '2'], buffer: [], stack: [] }),
        `.border-t-2 {
  border-top-width: 2px;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Border, { contents: ['dashed', 'black'], buffer: [], stack: [] }),
        `.border-dashed-black {
  border: dashed;
  border-color: black;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Border, { contents: ['10', 'dashed', 'black'], buffer: [], stack: [] }),
        `.border-10-dashed-black {
  border: dashed;
  border-color: black;
  border-width: 10px;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Border, { contents: ['10', 'dashed', 'black'], buffer: [], stack: ['active'] }),
        `.border-10-dashed-black:active {
  border: dashed;
  border-color: black;
  border-width: 10px;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Border, { contents: ['left', '10', 'dashed', 'black'], buffer: [], stack: ['active'] }),
        `.border-left-10-dashed-black:active {
  border: dashed;
  border-color: black;
  border-left-width: 10px;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Outline, { contents: ['10', 'dashed', 'black'], buffer: [], stack: [] }),
        `.outline-10-dashed-black {
  outline: dashed;
  outline-color: black;
  outline-width: 10px;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Text, { contents: ['2rem', 'black'], buffer: [], stack: [] }),
        `.text-2rem-black {
  color: black;
  font-size: 2rem;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Text, { contents: ['2rem'], buffer: [], stack: [] }),
        `.text-2rem {
  font-size: 2rem;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Text, { contents: ['arial'], buffer: [], stack: [] }),
        `.text-arial {
  font-family: 'Arial', sans-serif;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Text, { contents: ['center'], buffer: [], stack: [] }),
        `.text-center {
  text-align: center;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Text, { contents: ['arial', 'center', '#CC0000', '700'], buffer: [], stack: [] }),
        `.text-arial-center-cc0000-700 {
  color: #CC0000;
  text-align: center;
  font-size: 700px;
  font-weight: 700;
  font-family: 'Arial', sans-serif;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Background, { contents: ['#000000'], buffer: [], stack: [] }),
        `.bg-000000 {
  background-color: #000000;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Background, { contents: ['#000000'], buffer: [], stack: ['dark'] }),
        `.dark .bg-000000-dark {
  background-color: #000000;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Background, { contents: ['rgb-255-255-255'], buffer: [], stack: [] }),
        `.bg-rgb-255-255-255 {
  background-color: rgb(255, 255, 255);
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Background, { contents: ['rgba-255-255-255-0.5'], buffer: [], stack: [] }),
        `.bg-rgba-255-255-255-05 {
  background-color: rgba(255, 255, 255, 0.5);
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Background, { contents: ['hsl-0-100%-50%'], buffer: [], stack: [] }),
        `.bg-hsl-0-100-50 {
  background-color: hsl(0, 100%, 50%);
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Background, { contents: ['hsla-0-100%-50%-0.5'], buffer: [], stack: [] }),
        `.bg-hsla-0-100-50-05 {
  background-color: hsla(0, 100%, 50%, 0.5);
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Background, { contents: ['--primary-color'], buffer: [], stack: [] }),
        `.bg---primary-color {
  background-color: var(--primary-color);
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Background, { contents: ['#000001', 'cover'], buffer: [], stack: [] }),
        `.bg-000001-cover {
  background-color: #000001;
  background-size: cover;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Background, { contents: ['/test.png'], buffer: [], stack: [] }),
        `.bg-testpng {
  background-image: url("/test.png");
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Background, { contents: ['/foo.png', 'auto'], buffer: [], stack: [] }),
        `.bg-foopng-auto {
  background-image: url("/foo.png");
  background-size: auto;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Background, { contents: ['transparent'], buffer: [], stack: [] }),
        `.bg-transparent {
  background-color: transparent;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Flexbox, { contents: ['row', 'grow'], buffer: [], stack: [] }),
        `.flex-row-grow {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Flexbox, { contents: ['row', 'v-center', 'h-center'], buffer: [], stack: [] }),
        `.flex-row-v-center-h-center {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Flexbox, { contents: ['row', 'v-stretch', 'h-start'], buffer: [], stack: [] }),
        `.flex-row-v-stretch-h-start {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Flexbox, { contents: ['row', 'v-start', 'h-between'], buffer: [], stack: [] }),
        `.flex-row-v-start-h-between {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Flexbox, { contents: ['col-reverse', 'grow-none'], buffer: [], stack: [] }),
        `.flex-col-reverse-grow-none {
  display: flex;
  flex-direction: column-reverse;
  flex-grow: 0;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Flexbox, { contents: ['col-reverse', 'grow-none', 'gap-2rem'], buffer: [], stack: [] }),
        `.flex-col-reverse-grow-none-gap-2rem {
  display: flex;
  flex-direction: column-reverse;
  flex-grow: 0;
  gap: 2rem;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Flexbox, { contents: ['wrap'], buffer: [], stack: [] }),
        `.flex-wrap {
  display: flex;
  flex-wrap: wrap;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Flexbox, { contents: ['nowrap'], buffer: [], stack: [] }),
        `.flex-nowrap {
  display: flex;
  flex-wrap: nowrap;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Flexbox, { contents: ['wrap-reverse'], buffer: [], stack: [] }),
        `.flex-wrap-reverse {
  display: flex;
  flex-wrap: wrap-reverse;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Flexbox, { contents: ['?', 'flex-1'], buffer: [], stack: [] }),
        `.flex-_none_-flex-1 {
  flex: 1 1 0%;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Flexbox, { contents: ['?', 'shrink-0'], buffer: [], stack: [] }),
        `.flex-_none_-shrink-0 {
  flex-shrink: 0;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Flexbox, { contents: ['flex-1'], buffer: [], stack: [] }),
        `.flex-flex-1 {
  display: flex;
  flex: 1 1 0%;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Width, { contents: ['100%'], buffer: [], stack: [] }),
        `.w-100 {
  width: 100%;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Width, { contents: ['max', '50vw'], buffer: [], stack: [] }),
        `.w-max-50vw {
  max-width: 50vw;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Width, { contents: ['100dvw'], buffer: [], stack: [] }),
        `.w-100dvw {
  width: 100dvw;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Height, { contents: ['300'], buffer: [], stack: [] }),
        `.h-300 {
  height: 300px;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Height, { contents: ['300px'], buffer: [], stack: [] }),
        `.h-300px {
  height: 300px;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Height, { contents: ['min', '100vh'], buffer: [], stack: [] }),
        `.h-min-100vh {
  min-height: 100vh;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Height, { contents: ['max', '10rem'], buffer: [], stack: [] }),
        `.h-max-10rem {
  max-height: 10rem;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Position, { contents: ['absolute'], buffer: [], stack: [] }),
        `.pos-absolute {
  position: absolute;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Position, { contents: ['sticky', 'left-2rem'], buffer: [], stack: [] }),
        `.pos-sticky-left-2rem {
  position: sticky;
  left: 2rem;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Position, { contents: ['relative', 'right-0'], buffer: [], stack: [] }),
        `.pos-relative-right-0 {
  position: relative;
  right: 0;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Position, { contents: ['!', 'sticky', 'left-2rem'], buffer: [], stack: [] }),
        `.pos-_important_-sticky-left-2rem {
  position: sticky !important;
  left: 2rem !important;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Scroll, { contents: ['hidden'], buffer: [], stack: [] }),
        `.scroll-hidden {
  overflow: hidden;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Scroll, { contents: ['x', 'auto'], buffer: [], stack: [] }),
        `.scroll-x-auto {
  overflow-x: auto;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Scroll, { contents: ['y', 'visible'], buffer: [], stack: [] }),
        `.scroll-y-visible {
  overflow-y: visible;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Scroll, { contents: [], buffer: [], stack: [] }),
        `.scroll {
  overflow: scroll;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Scroll, { contents: ['x'], buffer: [], stack: [] }),
        `.scroll-x {
  overflow-x: scroll;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Scroll, { contents: ['x'], buffer: [], stack: ['focus'] }),
        `.scroll-x:focus {
  overflow-x: scroll;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Float, { contents: ['right'], buffer: [], stack: [] }),
        `.float-right {
  float: right;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.ZIndex, { contents: ['5'], buffer: [], stack: [] }),
        `.z-5 {
  z-index: 5;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Display, { contents: ['none'], buffer: [], stack: [] }),
        `.display-none {
  display: none;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Rounded, { contents: ['1rem'], buffer: [], stack: [] }),
        `.rounded-1rem {
  border-radius: 1rem;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Rounded, { contents: ['25px', '2rem'], buffer: [], stack: [] }),
        `.rounded-25px-2rem {
  border-radius: 25px 2rem;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Rounded, { contents: ['25px', '2rem'], buffer: ['.rounded-10'], stack: ['xl'] }),
        `@media (min-width: 1536px) {
.rounded-10 {
  border-radius: 25px 2rem;
}
}`,
      ],
      [resolveCSS(UnunuraIdentifier.Reset, { contents: ['meyer'], buffer: [], stack: [] }), NULLABLE],
      [resolveCSS(UnunuraIdentifier.Reset, { contents: ['novout'], buffer: [], stack: [] }), NULLABLE],
      [resolveCSS(UnunuraIdentifier.Margin, { contents: ['2', '10', '5'], buffer: [], stack: [] }), NULLABLE],
      [resolveCSS(UnunuraIdentifier.Padding, { contents: ['2', '10', '5'], buffer: [], stack: [] }), NULLABLE],
      [resolveCSS('wrong' as any, { contents: ['foo', 'baz', 'bar'], buffer: [], stack: [] }), NULLABLE],
    ]

    for (const [cl, result] of targets) {
      expect(cl).toStrictEqual(result)
    }
  })

  it('should get css inline class', () => {
    const targets = [
      [
        resolveCSS(UnunuraIdentifier.Typography, { contents: ['uppercase'], buffer: [], stack: [] }),
        `.typo-uppercase {
  text-transform: uppercase;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Typography, { contents: ['capitalize'], buffer: [], stack: [] }),
        `.typo-capitalize {
  text-transform: capitalize;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Typography, { contents: ['indent-5'], buffer: [], stack: [] }),
        `.typo-indent-5 {
  text-indent: 5;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Typography, { contents: ['lspacing-5px'], buffer: [], stack: [] }),
        `.typo-lspacing-5px {
  letter-spacing: 5px;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Typography, { contents: ['wspacing-5px'], buffer: [], stack: [] }),
        `.typo-wspacing-5px {
  word-spacing: 5px;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Typography, { contents: ['line-30px'], buffer: [], stack: [] }),
        `.typo-line-30px {
  line-height: 30px;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Typography, { contents: ['center'], buffer: [], stack: [] }),
        `.typo-center {
  text-align: center;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Typography, { contents: ['decoration-none'], buffer: [], stack: [] }),
        `.typo-decoration-none {
  text-decoration: none;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Typography, { contents: ['clip'], buffer: [], stack: [] }),
        `.typo-clip {
  text-overflow: clip;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Typography, { contents: ['space-pre'], buffer: [], stack: [] }),
        `.typo-space-pre {
  white-space: pre;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Typography, { contents: ['break-normal'], buffer: [], stack: [] }),
        `.typo-break-normal {
  word-break: normal;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Typography, { contents: ['truncate'], buffer: [], stack: [] }),
        `.typo-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Transform, { contents: ['rotateX-90deg'], buffer: [], stack: [] }),
        `.tf-rotatex-90deg {
  transform: rotateX(90deg);
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Transform, { contents: ['skewX-30deg'], buffer: [], stack: [] }),
        `.tf-skewx-30deg {
  transform: skewX(30deg);
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Transform, { contents: ['rotateX-90deg', 'skewX-30deg'], buffer: [], stack: [] }),
        `.tf-rotatex-90deg-skewx-30deg {
  transform: rotateX(90deg) skewX(30deg);
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Shadow, { contents: ['text', 'h-10', 'v-10', 'blur-30', 'black'], buffer: [], stack: [] }),
        `.shadow-text-h-10-v-10-blur-30-black {
  text-shadow: 10px 10px 30px black;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Shadow, { contents: ['text', 'h-10', 'v-10', 'black'], buffer: [], stack: [] }),
        `.shadow-text-h-10-v-10-black {
  text-shadow: 10px 10px black;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Filter, { contents: ['blur-4px'], buffer: [], stack: [] }),
        `.filter-blur-4px {
  filter: blur(4px);
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Filter, { contents: ['backdrop', 'blur-4px'], buffer: [], stack: [] }),
        `.filter-backdrop-blur-4px {
  backdrop-filter: blur(4px);
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Filter, {
          contents: ['blur-4px', 'contrast-1', 'hue-30deg', 'grayscale-50%', 'invert-50%', 'saturate-1', 'sepia-50%'],
          buffer: [],
          stack: [],
        }),
        `.filter-blur-4px-contrast-1-hue-30deg-grayscale-50-invert-50-saturate-1-sepia-50 {
  filter: blur(4px) contrast(1) grayscale(50%) hue-rotate(30deg) invert(50%) saturate(1) sepia(50%);
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Filter, {
          contents: ['backdrop', 'blur-4px', 'contrast-1', 'hue-30deg', 'grayscale-50%', 'invert-50%', 'saturate-1', 'sepia-50%'],
          buffer: [],
          stack: [],
        }),
        `.filter-backdrop-blur-4px-contrast-1-hue-30deg-grayscale-50-invert-50-saturate-1-sepia-50 {
  backdrop-filter: blur(4px) contrast(1) grayscale(50%) hue-rotate(30deg) invert(50%) saturate(1) sepia(50%);
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Style, { contents: ['cursor-pointer'], buffer: [], stack: [] }),
        `.style-cursor-pointer {
  cursor: pointer;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Style, {
          contents: [
            'accent-#FF00FF',
            'appearance',
            'cursor-pointer',
            'events-none',
            'resize-none',
            'touch-auto',
            'scroll-smooth',
            'select-text',
          ],
          buffer: [],
          stack: [],
        }),
        `.style-accent-ff00ff-appearance-cursor-pointer-events-none-resize-none-touch-auto-scroll-smooth-select-text {
  accent-color: #FF00FF;
  appearance: none;
  cursor: pointer;
  touch-action: auto;
  pointer-events: none;
  resize: none;
  scroll-behavior: smooth;
  user-select: text;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Shadow, { contents: ['black'], buffer: [], stack: [] }),
        `.shadow-black {
  box-shadow: 5px 5px 5px 0px black;
  -webkit-box-shadow: 5px 5px 5px 0px black;
  -moz-box-shadow: 5px 5px 5px 0px black;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Shadow, { contents: ['h-10', 'v-10'], buffer: [], stack: [] }),
        `.shadow-h-10-v-10 {
  box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.5);
  -webkit-box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.5);
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Shadow, { contents: ['inset', 'h-10', 'v-10'], buffer: [], stack: [] }),
        `.shadow-inset-h-10-v-10 {
  box-shadow: inset 10px 10px 5px 0px rgba(0, 0, 0, 0.5);
  -webkit-box-shadow: inset 10px 10px 5px 0px rgba(0, 0, 0, 0.5);
  -moz-box-shadow: inset 10px 10px 5px 0px rgba(0, 0, 0, 0.5);
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Transition, {
          contents: ['delay-200ms', 'duration-1s', 'none', 'ease-in'],
          buffer: [],
          stack: [],
        }),
        `.tr-delay-200ms-duration-1s-none-ease-in {
  transition-delay: 200ms;
  transition-duration: 1s;
  transition-property: none;
  transition-timing-function: ease-in;
}`,
      ],
    ]

    for (const [css, result] of targets) {
      expect(css).toStrictEqual(result)
    }
  })

  it('should get css class in theme context', () => {
    const targets = [
      [
        resolveCSS(UnunuraIdentifier.Padding, { contents: ['5rem'], buffer: [], stack: ['sepia'] }),
        `.sepia .p-5rem-sepia {
  padding: 5rem;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Rounded, { contents: ['2rem'], buffer: [], stack: ['light'] }),
        `.light .rounded-2rem-light {
  border-radius: 2rem;
}`,
      ],
    ]

    for (const [css, result] of targets) {
      expect(css).toStrictEqual(result)
    }
  })

  it('should get css class in pseudo class context', () => {
    const targets = [
      [
        resolveCSS(UnunuraIdentifier.Padding, { contents: ['5rem'], buffer: [], stack: ['link'] }),
        `.p-5rem:link {
  padding: 5rem;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Rounded, { contents: ['2rem'], buffer: [], stack: ['valid'] }),
        `.rounded-2rem:valid {
  border-radius: 2rem;
}`,
      ],
    ]

    for (const [css, result] of targets) {
      expect(css).toStrictEqual(result)
    }
  })

  it('should get css class in pseudo element context', () => {
    const targets = [
      [
        resolveCSS(UnunuraIdentifier.Style, { contents: ['cursor-none'], buffer: [], stack: ['cue'] }),
        `.style-cursor-none::cue {
  cursor: none;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Style, { contents: ['cursor-none'], buffer: [], stack: ['selection'] }),
        `.style-cursor-none::selection {
  cursor: none;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Style, { contents: ['cursor-none'], buffer: [], stack: ['first-line'] }),
        `.style-cursor-none::first-line {
  cursor: none;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Rounded, { contents: ['2rem'], buffer: [], stack: ['selection', 'valid'] }),
        `.rounded-2rem::selection {
  border-radius: 2rem;
}`,
      ],
    ]

    for (const [css, result] of targets) {
      expect(css).toStrictEqual(result)
    }
  })

  it('should generate correct classes from raw context', () => {
    const targets = [
      [
        generateUniqueClass(['m', '10'], { contents: [], buffer: [], stack: [] }),
        `.m-10 {
  margin: 10px;
}`,
      ],
      [
        generateMultipleClass(['m', '0 10 0 0'], { contents: [], buffer: [], stack: [] }),
        `.m-0-10-0-0 {
  margin: 0px 10px 0px 0px;
}`,
      ],
    ]

    for (const [css, result] of targets) {
      expect(css).toStrictEqual(result)
    }
  })

  it('should get css class with ununura external options', () => {
    const targets = [
      [
        resolveCSS(UnunuraIdentifier.Text, {
          contents: ['primary'],
          buffer: [],
          stack: [],
          ununura: { extend: { supporters: { colors: [['primary', '#00FF00']] } } } as any,
        }),
        `.text-primary {
  color: #00FF00;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Text, {
          contents: ['primary'],
          buffer: [],
          stack: [],
          ununura: { extend: { supporters: { colors: [['primary', 'rgba(255, 255, 255, 0.1)']] } } } as any,
        }),
        `.text-primary {
  color: rgba(255, 255, 255, 0.1);
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Text, {
          contents: ['roboto'],
          buffer: [],
          stack: [],
          ununura: { extend: { supporters: { fonts: [['roboto', 'Roboto']] } } } as any,
        }),
        `.text-roboto {
  font-family: 'Roboto', sans-serif;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Text, {
          contents: ['primary', 'roboto'],
          buffer: [],
          stack: [],
          ununura: { extend: { supporters: { colors: [['primary', '#00FF00']], fonts: [['roboto', 'Roboto']] } } } as any,
        }),
        `.text-primary-roboto {
  color: #00FF00;
  font-family: 'Roboto', sans-serif;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Text, {
          contents: ['primary', 'roboto', 'md'],
          buffer: [],
          stack: [],
          ununura: {
            extend: {
              supporters: { colors: [['primary', '#00FF00']], fonts: [['roboto', 'Roboto']], units: [['md', '1.5rem']] },
            },
          } as any,
        }),
        `.text-primary-roboto-md {
  color: #00FF00;
  font-size: 1.5rem;
  font-family: 'Roboto', sans-serif;
}`,
      ],
    ]

    for (const [css, result] of targets) {
      expect(css).toStrictEqual(result)
    }
  })
})

describe.concurrent('css', () => {
  it('should get a resources from raw html', () => {
    const targets = [
      [getGlobalReset('reset:novout'), NOVOUT_RESET_CSS()],
      [getGlobalReset('reset:meyer'), MEYER_RESET_CSS()],
      [getGlobalReset('reset:foo'), ''],
      [getGlobalReset(), ''],
      [resolveIdentifierInCSS(UnunuraIdentifier.Text), 'font'],
      [resolveIdentifierInCSS(UnunuraIdentifier.Flexbox), 'flex'],
      [
        resolveTitleCssClass(UnunuraIdentifier.Margin, { contents: ['15', '0', '10', '0'], buffer: [], stack: [] }),
        '.m-15-0-10-0',
      ],
      [resolveTitleCssClass(UnunuraIdentifier.Flexbox, { contents: ['flex-1'], buffer: [], stack: [] }), '.flex-flex-1'],
      [resolveTitleCssClass(UnunuraIdentifier.Flexbox, { contents: ['flex-1'], buffer: [], stack: ['hover'] }), '.flex-flex-1'],
      [
        resolveTitleCssClass(UnunuraIdentifier.Background, { contents: ['rgba-255-255-255-0.3)'], buffer: [], stack: [] }),
        '.bg-rgba-255-255-255-03',
      ],
      [resolveTitleCssClass(UnunuraIdentifier.Background, { contents: ['#FF0000'], buffer: [], stack: [] }), '.bg-ff0000'],
      [
        resolveTitleCssClass(UnunuraIdentifier.Background, { contents: ['/local_image.png'], buffer: [], stack: [] }),
        '.bg-local-imagepng',
      ],
    ]

    for (const [raw, result] of targets) {
      expect(raw).toStrictEqual(result)
    }
  })
})

describe.concurrent('purge', () => {
  it('should purge or not css generated files', () => {
    const targets = [
      [
        purgeCSS(`.bg-#000000 {
  background-color: #000000;
}
.p-10 {
  padding: 10px;
}
.bg-#000000 {
  background-color: #000000;
}`),
        `.bg-#000000 {
  background-color: #000000;
}
.p-10 {
  padding: 10px;
}`,
      ],
      [
        purgeCSS(`.bg-#000000 {
  background-color: #000000;
}
.p-35 {
  padding: 35px;
}`),
        `.bg-#000000 {
  background-color: #000000;
}
.p-35 {
  padding: 35px;
}`,
      ],
      [
        purgeCSS(`a wrong css file`),
        `.
a wrong css file`,
      ],
      [
        purgeOnlyCssClassTitle(`.text-base {
  font-size: 1rem;
}`),
        'text-base',
      ],
      [
        purgeOnlyCssClassTitle(`.border-white {
    border-color: white;
  }`),
        'border-white',
      ],
    ]

    for (const [raw, result] of targets) {
      expect(raw).toStrictEqual(result)
    }
  })
})

describe.concurrent('support', () => {
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

describe.concurrent('fs', () => {
  it('should ignore files', async () => {
    const targets = [
      [scan({ include: ['**/*.xyz'], exclude: [] } as any), []],
      [UnunuraGlobalGenerate({ include: ['**/*.xyz'], exclude: [] } as any), ''],
    ]

    for (const [raw, result] of targets) {
      expect(await raw).toStrictEqual(result)
    }
  })
})
