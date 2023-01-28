export interface Route {
  to: string
  name: string
  children?: Route[]
}
