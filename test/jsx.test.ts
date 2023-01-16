import { classesFromRawJSX, UnunuraJSXSFCFile } from 'ununura-engine'
import { beforeEach, describe, expect, it } from 'vitest'

describe('resolvers', () => {
  beforeEach(() => {
    Math.random = () => -1
  })

  it('should correct jsx classes', () => {
    expect(
      classesFromRawJSX(`export const Foo = (props) => {
  return (
    <div className="m[top 20]">
      <h1>{props.test}</h1>
    </div>
  );
};

export const Bar = (props) => {
  return (
    <a className="p:20">
      <h1 className="typo[indent-5]">{props.test}</h1>
    </a>
  );
};`).map((node) => node.class)
    ).toStrictEqual(['m[top 20]', 'p:20', 'typo[indent-5]'])
  })

  it('should set new sfc', () => {
    const targets = [
      [
        UnunuraJSXSFCFile(`export const Foo = (props) => {
  return (
    <div className="m[top 20]">
      <h1>{props.test}</h1>
    </div>
  );
};

export const Bar = (props) => {
  return (
    <a className="p:20">
      <h1 className="typo[indent-5]">{props.test}</h1>
    </a>
  );
};`),
        `export const Foo = (props) => {
  return (
    <div className="m-top-20">
      <h1>{props.test}</h1>
    </div>
  );
};

export const Bar = (props) => {
  return (
    <a className="p-20">
      <h1 className="typo-indent-5">{props.test}</h1>
    </a>
  );
};`,
      ],
    ]

    for (const [sfc, result] of targets) {
      expect(sfc).toStrictEqual(result)
    }
  })
})
