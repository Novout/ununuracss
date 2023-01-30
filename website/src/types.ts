export interface Route {
  to: string
  name: string
  children?: Route[]
}

type Supporters = 'color' | 'unit' | 'fontFamily' | 'fontSize' | 'unique' | 'in-start' | 'in-middle' | 'in-end'
type SupporterItem = Supporters | { name: string; support: Supporters & string }
