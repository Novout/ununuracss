export enum UnunuraIdentifier {
  Padding = 'p',
  Margin = 'm',
  Height = 'h',
  Width = 'w',
  Border = 'border',
  Text = 'text',
  Background = 'bg',
  Flexbox = 'flex',
  Position = 'pos',
  Scroll = 'scroll',
  Reset = 'reset',
  Cursor = 'cursor',
  Shadow = 'shadow',
  Rounded = 'rounded',
  ZIndex = 'z',
  Display = 'display',
  Float = 'float',
}

export enum UnunuraGlobals {
  None = '?',
  Important = '!',
}

export type UnunuraContextualizeTheme = 'light' | 'dark' | 'sepia'
export type UnunuraContextualizeResponsive = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type UnunuraContextualize = UnunuraContextualizeTheme | UnunuraContextualizeResponsive
export type UnunuraContextualizeStack = UnunuraContextualize[]

export enum UnunuraKeys {
  MultipleContextOpen = '[',
  MultipleContextClose = ']',
  SpecificContextOpen = '(',
  SpecificContextClose = ')',
  UniqueContext = ':',
}
