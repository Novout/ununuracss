import autoprefixer from 'autoprefixer'
import postcss from 'postcss'

export const applyAutoprefixer = (rawCss: string): Promise<string> => {
  return new Promise((res, rej) => {
    postcss([autoprefixer({ env: 'last 4 version', grid: 'autoplace', flexbox: true })])
      .process(rawCss, { from: 'ununura.css', to: 'ununura.map.css' })
      .then((result) => {
        result.warnings().forEach((warn) => {
          // console.warn(warn.toString())

          rej(rawCss)
        })

        res(result.css)
      })
  })
}
