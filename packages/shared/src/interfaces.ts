import { UnunuraContextualizeStack, Option, ValueOption, Symbol, FontStack } from './types'

export interface UnunuraSetterCSSOptions {
  removeWhitespaceInStart?: boolean
  removeImportantCase?: boolean
  removeSemicolonAndBreakLineInEnd?: boolean
}

export interface UnunuraGenerateContext {
  stack: UnunuraContextualizeStack
  buffer: string[]
  contents: string[]
  node?: UnunuraASTNode
  filename?: string
  ununura?: UnunuraOptions
}

export interface UnunuraASTNode {
  class: string
  tag: string
  position: {
    start: { line: number; column: number; offset: number }
    end: { line: number; column: number; offset: number }
  }
  flag?: string
}

export interface UnunuraScannerFile {
  raw: string
  path: string
  filename: string
}

export interface UnunuraExtendSupportersColorOptions {
  type?: 'var'
}

export interface UnunuraExtendSupporters {
  colors?: Option<string, Record<Symbol, UnunuraExtendSupportersColorOptions>>
  units?: Option<string | number>
  fonts?: Option<string>
}

export interface UnunuraDefaultsContextsResponsive {
  xs?: string
  sm?: string
  md?: string
  lg?: string
  xl?: string
}

export interface UnunuraDefaultsContexts {
  responsive?: UnunuraDefaultsContextsResponsive
}

export interface UnunuraDefaultsValues {
  fontStack?: FontStack
  unit?: [string, number]
}

export interface UnunuraDefaults {
  values?: UnunuraDefaultsValues
  contexts?: UnunuraDefaultsContexts
}

export interface UnunuraExtendContexts {
  responsive?: Option<string>
  theme?: string[]
}

export interface UnunuraExtend {
  contexts?: UnunuraExtendContexts
  supporters?: UnunuraExtendSupporters
}

export interface UnunuraResolvableOptions {
  /**
   *  Shorten classes using a single key, for example:
   *
   *```ts
   *  ununura({
   *    defines: [
   *      ['btn', 'style:cursor-pointer p[1rem 2.5rem] rounded:0.5rem bg:purple text:white']
   *    ]
   *  })
   *
   *  // class="btn m[bottom 2rem]..."
```
   */
  defines?: ValueOption<string>
  /**
   * Override some internal values.
   *
   *```ts
   *defaults: {
   *   values: {
   *      unit: ['rem', 0.25]
   *   }
   * }
   *```
   *
   * @default {}
   */
  defaults?: UnunuraDefaults
  /**
   * Extend default settings for special customizations.
   *
   *```ts
   *ununura({
   *  extend: {
   *    supporters: {
   *      colors: [
   *        ['primary', '#00FF00'],
   *        ['secondary', '--secondary-color', { type: 'var' }]
   *      ],
   *      units: {
   *        lg: '1.5rem',
   *        xl: {
   *          value: '2rem',
   *          options: {
   *            //...
   *          }
   *        }
   *      },
   *      fonts: [
   *        ['roboto', 'Roboto']
   *      ]
   *    }
   *  }
   *})
   *
   *  // class="text[primary lg roboto] typo[center indent-1rem]..."
   *```
   */
  extend?: UnunuraExtend
  /**
   * For use JSX specification (in React or other similar setup), enable this option.
   *
   *```ts
   *ununura({
   *  jsx: true
   *})
   * ```
   *
   * @default false
   */
  jsx?: boolean
  /**
   * If using JSX, this option ignores the `main.(tsx|jsx)` file.
   *
   * @default true
   */
  jsxIgnoreEntryFile?: boolean
  /**
   * Specify other HTML attributes to be considered as valid classes. This option is used to transform titles and generate custom component classes.
   *
   *```ts
   *ununura({
   *  astAdapters: ['activeColor']
   *})
   *
   * // <CustomElement activeColor="text[! white]" />
   *```
   *
   * @default []
   */
  astAdapters?: string[]
  /**
   *  If you are using a framework that has the scoped option by default, such as vue and svelte, the generated css will be attached to the `<style>` of each component. Otherwise, it will be appended to 'ununura.css'. In general, do not change this option.
   *
   * @default true
   */
  scopedInTemplate?: boolean
  /**
   * This option identifies custom HMRs such as astro or nitro. Do not interfere with this option.
   *
   * @default 'vite'
   */
  specialEnvironment?: 'vite' | 'nitro' | 'astro' | 'runtime'
  /**
   * Use https://github.com/danielroe/fontaine
   *
   * @default true
   */
  fontainePlugin?: boolean
  /**
   * Apply the PostCSS autoprefixer package.
   *
   * @default true
   */
  applyAutoprefixer?: boolean
  /**
   * This option disables features in the title of each generated class. **ATTENTION!** With this option active, Ununura does not guarantee that all classes will be unique!
   *
   * @default false
   */
  simplifyTitles?: boolean
  /**
   *
   * Use `nanoid` for hash resources in title.
   *
   * @default true
   */
  hashTitles?: boolean
  /**
   *  If using `applyAutoprefixer: true`, choose a custom browserslist.
   *
   * @default false
   */
  overrideBrowserslist?: string[] | string | false
  /**
   * Ignore the current class line in the title of each generated class. **ATTENTION!** With this option active, Ununura does not guarantee that all classes will be unique!
   *
   * @default false
   */
  forceIgnoreClassLineInTitles?: boolean
  /**
   * Change the Rollup transformation from 'pre' to 'post'. Only change this option if you know exactly what you are doing.
   *
   * @default false
   */
  forceHydratedTemplate?: boolean
  /**
   * Restart HRM Server in valid Hot Reload Files.
   *
   * @default false
   */
  forceAlwaysRestartHMRServer?: boolean
}

export interface UnunuraOptions {
  /**
   *  Shorten classes using a single key, for example:
   *
   *```ts
   *  ununura({
   *    defines: [
   *      ['btn', 'style:cursor-pointer p[1rem 2.5rem] rounded:0.5rem bg:purple text:white']
   *    ]
   *  })
   *
   *  // class="btn m[bottom 2rem]..."
```
   */
  defines: ValueOption<string>
  /**
   * Override some internal values.
   *
   *```ts
   *defaults: {
   *   values: {
   *      unit: ['rem', 0.25]
   *   }
   * }
   *```
   *
   * @default {}
   */
  defaults: UnunuraDefaults
  /**
   * Extend default settings for special customizations.
   *
   *```ts
   *ununura({
   *  extend: {
   *    supporters: {
   *      colors: [
   *        ['primary', '#00FF00'],
   *        ['secondary', '--secondary-color', { type: 'var' }]
   *      ],
   *      units: {
   *        lg: '1.5rem',
   *        xl: {
   *          value: '2rem',
   *          options: {
   *            //...
   *          }
   *        }
   *      },
   *      fonts: [
   *        ['roboto', 'Roboto']
   *      ]
   *    }
   *  }
   *})
   *
   *  // class="text[primary lg roboto] typo[center indent-1rem]..."
   *```
   */
  extend: UnunuraExtend
  /**
   * For use JSX specification (in React or other similar setup), enable this option.
   *
   *```ts
   *ununura({
   *  jsx: true
   *})
   * ```
   *
   * @default false
   */
  jsx: boolean
  /**
   * If using JSX, this option ignores the `main.(tsx|jsx)` file.
   *
   * @default true
   */
  jsxIgnoreEntryFile: boolean
  /**
   * Specify other HTML attributes to be considered as valid classes. This option is used to transform titles and generate custom component classes.
   *
   *```ts
   *ununura({
   *  astAdapters: ['activeColor']
   *})
   *
   * // <CustomElement activeColor="text[! white]" />
   *```
   *
   * @default []
   */
  astAdapters: string[]
  /**
   *  If you are using a framework that has the scoped option by default, such as vue and svelte, the generated css will be attached to the `<style>` of each component. Otherwise, it will be appended to 'ununura.css'. In general, do not change this option.
   *
   * @default true
   */
  scopedInTemplate: boolean
  /**
   * This option identifies custom HMRs such as astro or nitro. Do not interfere with this option.
   *
   * @default 'vite'
   */
  specialEnvironment: 'vite' | 'nitro' | 'astro' | 'runtime'
  /**
   * Use https://github.com/danielroe/fontaine
   *
   * @default true
   */
  fontainePlugin: boolean
  /**
   * Apply the PostCSS autoprefixer package.
   *
   * @default true
   */
  applyAutoprefixer: boolean
  /**
   *  If using `applyAutoprefixer: true`, choose a custom browserslist.
   *
   * @default false
   */
  overrideBrowserslist: string[] | string | false
  /**
   * This option disables features in the title of each generated class. **ATTENTION!** With this option active, Ununura does not guarantee that all classes will be unique!
   *
   * @default false
   */
  simplifyTitles: boolean
  /**
   *
   * Use `nanoid` for hash resources in title.
   *
   * @default true
   */
  hashTitles: boolean
  /**
   * Ignore the current class line in the title of each generated class. **ATTENTION!** With this option active, Ununura does not guarantee that all classes will be unique!
   *
   * @default false
   */
  forceIgnoreClassLineInTitles: boolean
  /**
   * Change the Rollup transformation from 'pre' to 'post'. Only change this option if you know exactly what you are doing.
   *
   * @default false
   */
  forceHydratedTemplate: boolean
  /**
   * Restart HRM Server in valid Hot Reload Files.
   *
   * @default false
   */
  forceAlwaysRestartHMRServer: boolean
}

export interface UnunuraCoreOptions extends UnunuraOptions {
  include?: string[]
  exclude?: string[]
}
