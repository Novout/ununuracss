import { resolveCSS } from 'ununura-engine'
import { UnunuraIdentifier } from 'ununura-shared'
import { describe, expect, it } from 'vitest'
import tailwindStyle from 'ununura-style-tailwindcss'

describe.concurrent('styles', () => {
  it('should get css class using tailwind style', () => {
    const targets = [
      [
        resolveCSS(UnunuraIdentifier.Padding, { contents: ['2'], buffer: [], stack: [], ununura: { ...tailwindStyle } as any }),
        `.padding-2 {
  padding: 0.5rem;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Padding, { contents: ['5.5'], buffer: [], stack: [], ununura: { ...tailwindStyle } as any }),
        `.padding-55 {
  padding: 1.375rem;
}`,
      ],
      [
        resolveCSS(UnunuraIdentifier.Text, {
          contents: ['red-500', 'lg', '700'],
          buffer: [],
          stack: [],
          ununura: { ...tailwindStyle } as any,
        }),
        `.text-red-500-lg-700 {
  color: #ef4444;
  font-size: 1.125rem;
  font-weight: 700;
}`,
      ],
    ]

    for (const [cl, result] of targets) {
      expect(cl).toStrictEqual(result)
    }
  })
})
