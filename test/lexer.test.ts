import { lex, lexToRawTitles } from 'ununura-engine'
import { isKey } from 'ununura-shared'
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
        lex('text[lg primary roboto] filter[blur-80px] shadow[h-0 v-0 blur-10 radius-10 red]', {} as any),
        [
          'text',
          '[',
          'lg primary roboto',
          ']',
          'filter',
          '[',
          'blur-80px',
          ']',
          'shadow',
          '[',
          'h-0 v-0 blur-10 radius-10 red',
          ']',
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
        lex('md(hover(dark(xl(active(light(xl(focus(sepia(bg:rgba-0-0-0-0.1))))))))) foo bar style:cursor baz', {} as any),
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
          'style',
          ':',
          'cursor',
        ],
      ],
    ]

    for (const [lex, result] of targets) {
      expect(lex).toStrictEqual(result)
    }
  })

  it('should not lex a similar identifiers', () => {
    expect(lex('bg-red text-white', {} as any)).toStrictEqual([])
  })

  it('should not lex a similar identifiers in same context', () => {
    expect(lex('f:col filter[blur-80px]', {} as any)).toStrictEqual(['f', ':', 'col', 'filter', '[', 'blur-80px', ']'])
  })

  it('should lex custom extend', () => {
    const targets = [
      [
        lex('bg:white foo(bg:red)', { extend: { contexts: { responsive: { foo: 'foo' } } } } as any),
        ['bg', ':', 'white', 'foo', '(', 'bg', ':', 'red', ')'],
      ],
      [
        lex('bg:white foo(text:white bar(baz(bg:red)))', {
          extend: { contexts: { responsive: { foo: '200px', bar: '300px', baz: '400px' } } },
        } as any),
        ['bg', ':', 'white', 'foo', '(', 'text', ':', 'white', 'bar', '(', 'baz', '(', 'bg', ':', 'red', ')', ')', ')'],
      ],
      [
        lex('bg:white foo(bg:red)', { extend: { contexts: { theme: ['foo'] } } } as any),
        ['bg', ':', 'white', 'foo', '(', 'bg', ':', 'red', ')'],
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
      [
        lex('subbtn btn', {
          defines: [
            ['btn', 'style[cursor-pointer] p[1rem 2.5rem]'],
            ['subbtn', 'border:10 text:10'],
          ],
        } as any),
        ['border', ':', '10', 'text', ':', '10', 'style', '[', 'cursor-pointer', ']', 'p', '[', '1rem 2.5rem', ']'],
      ],
    ]

    for (const [lex, result] of targets) {
      expect(lex).toStrictEqual(result)
    }
  })

  it('should lex raw title classes', () => {
    expect(lexToRawTitles('text-red border:10 text[2rem 700] filter[blur-80px] foo bar baz')).toStrictEqual([
      'text-red',
      'border:10',
      'text[2rem 700]',
      'filter[blur-80px]',
      'foo',
      'bar',
      'baz',
    ])
  })

  it('should lex raw title classes with contexts', () => {
    expect(lexToRawTitles('text-red filter[blur-80px] xl(filter:blur-20px)')).toStrictEqual([
      'text-red',
      'filter[blur-80px]',
      'xl(filter:blur-20px)',
    ])
  })

  it('should not ignore in lex raw title classes', () => {
    expect(lexToRawTitles('text-red bg-white z-9999')).toStrictEqual(['text-red', 'bg-white', 'z-9999'])
  })

  it('should not get a key', () => {
    expect(isKey(' ')).toBeFalsy()
  })

  it('should get a key', () => {
    ;[':', '(', ')', '[', ']'].forEach((key) => expect(isKey(key)).toBeTruthy())
  })
})
