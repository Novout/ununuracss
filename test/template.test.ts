import { classesFromRawHtml, generateCssFromNodes } from 'ununura-engine'
import { describe, expect, it } from 'vitest'

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
      [
        classesFromRawHtml('<div exactClassName="text[white 700]" class="bg:white" />', ['exactclassname']).map(
          (node) => node.class
        ),
        ['text[white 700]', 'bg:white'],
      ],
    ]

    for (const [raw, result] of targets) {
      expect(raw).toStrictEqual(result)
    }
  })
})
