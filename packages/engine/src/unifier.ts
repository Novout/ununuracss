import {
  isResponsiveContextIdentifier,
  UnunuraGenerateContext,
  UnunuraOptions,
  isIdentifier,
  isThemeContextIdentifier,
  UnunuraIdentifier,
  NULLABLE,
  Nullable,
} from 'ununura-shared'
import { getExtendedContextResponsive, getExtendedContextTheme, normalizeUnunuraOption } from './externals'

export const asResponsiveInContext = (ctx: UnunuraGenerateContext) => {
  return getExtendedContextResponsive(ctx) ?? ctx.stack?.find((c) => isResponsiveContextIdentifier(c))
}

export const asThemeInContext = (ctx: UnunuraGenerateContext) => {
  return getExtendedContextTheme(ctx) ?? ctx.stack?.find((c) => isThemeContextIdentifier(c))
}

export const getUniqueIdentifier = (identifier: UnunuraIdentifier): Nullable<string> => {
  switch (identifier) {
    case UnunuraIdentifier.Margin:
    case UnunuraIdentifier.MarginExtended:
      return 'margin'
    case UnunuraIdentifier.Padding:
    case UnunuraIdentifier.PaddingExtended:
      return 'padding'
    case UnunuraIdentifier.Rounded:
    case UnunuraIdentifier.RoundedExtended:
      return 'rounded'
    case UnunuraIdentifier.Height:
    case UnunuraIdentifier.HeightExtended:
      return 'height'
    case UnunuraIdentifier.Width:
    case UnunuraIdentifier.WidthExtended:
      return 'width'
    case UnunuraIdentifier.Background:
    case UnunuraIdentifier.BackgroundExtended:
      return 'background'
    case UnunuraIdentifier.Text:
    case UnunuraIdentifier.TextFont:
      return 'text'
    case UnunuraIdentifier.Border:
    case UnunuraIdentifier.BorderExtended:
      return 'border'
    case UnunuraIdentifier.Outline:
    case UnunuraIdentifier.OutlineExtended:
      return 'outline'
    case UnunuraIdentifier.Flexbox:
    case UnunuraIdentifier.FlexboxExtended:
      return 'flex'
    case UnunuraIdentifier.Grid:
    case UnunuraIdentifier.GridExtended:
      return 'grid'
    case UnunuraIdentifier.Position:
    case UnunuraIdentifier.PositionExtended:
      return 'position'
    case UnunuraIdentifier.Scroll:
    case UnunuraIdentifier.ScrollExtended:
      return 'scroll'
    case UnunuraIdentifier.Shadow:
    case UnunuraIdentifier.ShadowExtended:
      return 'shadow'
    case UnunuraIdentifier.ZIndex:
    case UnunuraIdentifier.ZIndexExtended:
      return 'zindex'
    case UnunuraIdentifier.Display:
    case UnunuraIdentifier.DisplayExtended:
      return 'display'
    case UnunuraIdentifier.Float:
    case UnunuraIdentifier.FloatExtended:
      return 'float'
    case UnunuraIdentifier.Transition:
    case UnunuraIdentifier.TransitionExtended:
      return 'transition'
    case UnunuraIdentifier.Transform:
    case UnunuraIdentifier.TransformExtended:
      return 'transform'
    case UnunuraIdentifier.Typography:
    case UnunuraIdentifier.TypographyExtended:
      return 'typography'
    case UnunuraIdentifier.Style:
    case UnunuraIdentifier.StyleExtended:
      return 'style'
    case UnunuraIdentifier.Filter:
    case UnunuraIdentifier.FilterExtended:
      return 'filter'
    case UnunuraIdentifier.Gradient:
    case UnunuraIdentifier.GradientExtended:
      return 'gradient'
    case UnunuraIdentifier.Animation:
    case UnunuraIdentifier.AnimationExtended:
      return 'animation'
    case UnunuraIdentifier.Collection:
    case UnunuraIdentifier.CollectionExtended:
      return 'collection'
    case UnunuraIdentifier.Opacity:
    case UnunuraIdentifier.OpacityExtended:
      return 'opacity'
    case UnunuraIdentifier.Reset: //global
      return 'reset'
    default:
      return NULLABLE
  }
}

export const isExistentIdentifier = (target: string, ununura: UnunuraOptions) => {
  const isCustomContextResponsive = normalizeUnunuraOption(ununura?.extend?.contexts?.responsive)?.some(([key]) => key === target)
  const isCustomContextTheme = ununura?.extend?.contexts?.theme?.some((key) => key === target)

  return isCustomContextResponsive || isCustomContextTheme || isIdentifier(target)
}
