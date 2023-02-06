import { normalizeUnunuraOption } from 'ununura-engine'
import { beforeEach, describe, expect, it } from 'vitest'

describe('externals', () => {
  beforeEach(() => {
    Math.random = () => -1
  })

  it('should load correct array to tuple options', () => {
    expect(normalizeUnunuraOption([['foo', 'bar']])).toStrictEqual([['foo', 'bar']])
  })

  it('should load correct array with options to tuple options', () => {
    expect(normalizeUnunuraOption([['foo', 'bar', { baz: 'baz' }]])).toStrictEqual([['foo', 'bar', { baz: 'baz' }]])
  })

  it('should load correct object to tuple options', () => {
    expect(
      normalizeUnunuraOption({
        foo: 'bar',
      })
    ).toStrictEqual([['foo', 'bar']])
  })

  it('should load correct object with options to tuple options', () => {
    expect(
      normalizeUnunuraOption({
        foo: { value: 'bar', options: { baz: 'baz' } },
      })
    ).toStrictEqual([['foo', 'bar', { baz: 'baz' }]])
  })
})
