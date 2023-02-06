import { scan, UnunuraGlobalGenerate } from 'ununura-engine'
import { describe, expect, it } from 'vitest'

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
