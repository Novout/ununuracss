import { describe, expect, it } from 'vitest'
import { getFontFamilyCallback } from 'ununura-font-stacks'

describe.concurrent('font-family', () => {
  it('should get a common case', () => {
    expect(getFontFamilyCallback('Roboto')).toStrictEqual('Roboto, system-ui, sans-serif')
  })

  it('should get a wrong type case', () => {
    expect(getFontFamilyCallback('Roboto', 'foo' as any)).toStrictEqual('Roboto, system-ui, sans-serif')
  })

  it('should get a common case with semicolon', () => {
    expect(getFontFamilyCallback('Roboto', 'system-ui', { semicolon: true })).toStrictEqual('Roboto, system-ui, sans-serif;')
  })

  it('should get a common case with emojis', () => {
    expect(getFontFamilyCallback('Roboto', 'system-ui', { emojis: true })).toStrictEqual(
      "Roboto, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
    )
  })

  it('should get a custom case', () => {
    expect(getFontFamilyCallback('Roboto')).toStrictEqual('Roboto, system-ui, sans-serif')
  })

  it('should get a custom case with semicolon', () => {
    expect(getFontFamilyCallback('Roboto', 'humanist', { semicolon: true })).toStrictEqual(
      "Roboto, Seravek, 'Gill Sans Nova', Ubuntu, Calibri, 'DejaVu Sans', source-sans-pro, sans-serif;"
    )
  })

  it('should get a custom case with emojis', () => {
    expect(getFontFamilyCallback('Roboto', 'humanist', { emojis: true })).toStrictEqual(
      "Roboto, Seravek, 'Gill Sans Nova', Ubuntu, Calibri, 'DejaVu Sans', source-sans-pro, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
    )
  })
})
