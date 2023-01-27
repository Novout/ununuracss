import autoprefixer from 'autoprefixer'
import postcss from 'postcss'
import { UnunuraOptions } from 'ununura-shared'

export const applyAutoprefixer = (rawCss: string, { overrideBrowserslist }: UnunuraOptions): Promise<string> => {
  return new Promise(async (res, rej) => {
    postcss()
      .use(
        autoprefixer({
          add: true,
          grid: 'autoplace',
          flexbox: true,
          overrideBrowserslist: overrideBrowserslist ? overrideBrowserslist : ['last 4 version'],
        })
      )
      .process(rawCss, { from: 'ununura.css', to: 'ununura.map.css' })
      .then(({ css }) => {
        res(css)
      })
      .catch(() => {
        rej(rawCss)
      })
  })
}
