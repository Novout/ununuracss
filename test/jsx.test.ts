import { classesFromRawJSX, getGlobals, UnunuraGlobalGenerateReduced, UnunuraJSXSFCFile } from 'ununura-engine'
import { MEYER_RESET_CSS, NOVOUT_RESET_CSS } from 'ununura-shared'
import { beforeEach, describe, expect, it } from 'vitest'

describe.concurrent('jsx resolvers', () => {
  beforeEach(() => {
    Math.random = () => -1
  })

  it('should set css in jsx valid novout reset', async () => {
    const files = [
      {
        raw: `export const Foo = (props) => {
  return (
    <p className="reset:novout" />
  );
};`,
        path: 'path/to/foo.tsx',
        filename: 'foo.tsx',
      },
    ]

    const rawGlobals = getGlobals(files, { jsx: true } as any)

    const target = await UnunuraGlobalGenerateReduced(files, rawGlobals, { jsx: true, scopedInTemplate: false } as any)

    expect(target).toBe(NOVOUT_RESET_CSS())
  })

  it('should set css in jsx valid meyer reset', async () => {
    const files = [
      {
        raw: `export const Foo = (props) => {
  return (
    <p className="reset:meyer" />
  );
};`,
        path: 'path/to/foo.tsx',
        filename: 'foo.tsx',
      },
    ]

    const rawGlobals = getGlobals(files, { jsx: true } as any)

    const target = await UnunuraGlobalGenerateReduced(files, rawGlobals, { jsx: true, scopedInTemplate: false } as any)

    expect(target).toBe(MEYER_RESET_CSS())
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
        UnunuraJSXSFCFile(
          `export const Foo = (props) => {
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
};`,
          '',
          {} as any
        ),
        `export const Foo = (props) => {
  return (
    <div className="margin-top-20">
      <h1>{props.test}</h1>
    </div>
  );
};

export const Bar = (props) => {
  return (
    <a className="padding-20">
      <h1 className="typography-indent-5">{props.test}</h1>
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
