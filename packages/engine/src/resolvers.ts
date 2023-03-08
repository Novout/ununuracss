import {
  UnunuraIdentifier,
  NULLABLE,
  Nullable,
  isNullable,
  UnunuraGenerateContext,
  isPseudoClassContextIdentifier,
  isPseudoElementContextIdentifier,
} from 'ununura-shared'
import { hashTitleResources } from './hash'
import { purgeOnlyCssClassTitle } from './purge'
import {
  getResourceText,
  getResourceBorder,
  getResourceFlex,
  getResourceWidthOrHeight,
  getResourceBackground,
  getResourcePosition,
  getResourceScroll,
  getResourceShadow,
  getResourceFloat,
  getResourceDisplay,
  getResourceZIndex,
  getResourceTransition,
  getResourceTypography,
  getResourceTransform,
  getResourceRounded,
  getResourcePaddingOrMargin,
  getResourceGrid,
  getResourceOutline,
  getResourceFilter,
  getResourceStyle,
  getResourceGradient,
  getResourceAnimation,
  getResourceCollection,
} from './resources'
import { TemplateClassResponsive, TemplateDefaultClass } from './template'
import { asResponsiveInContext, asThemeInContext, getUniqueIdentifier } from './unifier'

export const resolveTitleToClassName = (title: string) => {
  const normalized = title
    .replaceAll('[', '')
    .replaceAll(']', '')
    .replace(/[.%\s]/gi, '') // defaults
    .replace(/[,_\s]/gi, '-')
    .replace(/[():#/\s]/gi, '')
    .replace(/ /gi, '')
    .replaceAll('?', '_none_') // globals
    .replaceAll('!', '_important_')
    .toLowerCase()

  return normalized
}

export const resolveHashTitle = (prefix: string, ctx: UnunuraGenerateContext) => {
  // test mode
  if (Math.random() === -1) return prefix

  if (ctx?.node?.position) {
    const { start } = ctx.node.position

    const target = `${prefix}${!ctx.ununura?.forceIgnoreClassLineInTitles ? `-${start.line}` : ''}-${
      ctx.filename ? resolveTitleToClassName(ctx.filename.replace(/(.vue|.svelte|.jsx|.tsx|.astro|.html)/, '')) : ''
    }`

    return target
  }

  return prefix
}

export const resolveIdentifierInCSS = (identifier: UnunuraIdentifier): string => {
  switch (identifier) {
    case UnunuraIdentifier.Margin:
    case UnunuraIdentifier.MarginExtended:
      return 'margin'
    case UnunuraIdentifier.Padding:
    case UnunuraIdentifier.PaddingExtended:
      return 'padding'
    case UnunuraIdentifier.Background:
    case UnunuraIdentifier.BackgroundExtended:
      return 'background'
    case UnunuraIdentifier.Text:
    case UnunuraIdentifier.TextFont:
      return 'font'
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
    case UnunuraIdentifier.Height:
    case UnunuraIdentifier.HeightExtended:
      return 'height'
    case UnunuraIdentifier.Width:
    case UnunuraIdentifier.WidthExtended:
      return 'width'
    case UnunuraIdentifier.Position:
    case UnunuraIdentifier.PositionExtended:
      return 'pos'
    case UnunuraIdentifier.Scroll:
    case UnunuraIdentifier.ScrollExtended:
      return 'scroll'
    case UnunuraIdentifier.Shadow:
    case UnunuraIdentifier.ShadowExtended:
      return 'shadow'
    case UnunuraIdentifier.Rounded:
    case UnunuraIdentifier.RoundedExtended:
      return 'border-radius'
    case UnunuraIdentifier.ZIndex:
    case UnunuraIdentifier.ZIndexExtended:
      return 'z-index'
    case UnunuraIdentifier.Display:
    case UnunuraIdentifier.DisplayExtended:
      return 'display'
    case UnunuraIdentifier.Float:
    case UnunuraIdentifier.FloatExtended:
      return 'float'
    case UnunuraIdentifier.Typography:
    case UnunuraIdentifier.TypographyExtended:
      return 'text'
    case UnunuraIdentifier.Transition:
    case UnunuraIdentifier.TransitionExtended:
      return 'transition'
    case UnunuraIdentifier.Transform:
    case UnunuraIdentifier.TransformExtended:
      return 'transform'
    case UnunuraIdentifier.Filter:
    case UnunuraIdentifier.FilterExtended:
      return 'filter'
    case UnunuraIdentifier.Style:
    case UnunuraIdentifier.StyleExtended:
      return 'style'
    case UnunuraIdentifier.Gradient:
    case UnunuraIdentifier.GradientExtended:
      return 'gradient'
    case UnunuraIdentifier.Animation:
    case UnunuraIdentifier.AnimationExtended:
      return 'animation'
    case UnunuraIdentifier.Collection:
    case UnunuraIdentifier.CollectionExtended:
      return 'collection'
    case UnunuraIdentifier.Reset:
      return 'reset'
  }
}

export const resolveCSS = (identifier: UnunuraIdentifier, ctx: UnunuraGenerateContext): string => {
  switch (identifier) {
    case UnunuraIdentifier.Margin:
    case UnunuraIdentifier.MarginExtended:
    case UnunuraIdentifier.Padding:
    case UnunuraIdentifier.PaddingExtended:
      return getResourcePaddingOrMargin(identifier, ctx)
    case UnunuraIdentifier.Rounded:
    case UnunuraIdentifier.RoundedExtended:
      return getResourceRounded(identifier, ctx)
    case UnunuraIdentifier.Height:
    case UnunuraIdentifier.HeightExtended:
    case UnunuraIdentifier.Width:
    case UnunuraIdentifier.WidthExtended:
      return getResourceWidthOrHeight(identifier, ctx)
    case UnunuraIdentifier.Background:
    case UnunuraIdentifier.BackgroundExtended:
      return getResourceBackground(identifier, ctx)
    case UnunuraIdentifier.Text:
    case UnunuraIdentifier.TextFont:
      return getResourceText(identifier, ctx)
    case UnunuraIdentifier.Border:
    case UnunuraIdentifier.BorderExtended:
      return getResourceBorder(identifier, ctx)
    case UnunuraIdentifier.Outline:
    case UnunuraIdentifier.OutlineExtended:
      return getResourceOutline(identifier, ctx)
    case UnunuraIdentifier.Flexbox:
    case UnunuraIdentifier.FlexboxExtended:
      return getResourceFlex(identifier, ctx)
    case UnunuraIdentifier.Grid:
    case UnunuraIdentifier.GridExtended:
      return getResourceGrid(identifier, ctx)
    case UnunuraIdentifier.Position:
    case UnunuraIdentifier.PositionExtended:
      return getResourcePosition(identifier, ctx)
    case UnunuraIdentifier.Scroll:
    case UnunuraIdentifier.ScrollExtended:
      return getResourceScroll(identifier, ctx)
    case UnunuraIdentifier.Shadow:
    case UnunuraIdentifier.ShadowExtended:
      return getResourceShadow(identifier, ctx)
    case UnunuraIdentifier.ZIndex:
    case UnunuraIdentifier.ZIndexExtended:
      return getResourceZIndex(identifier, ctx)
    case UnunuraIdentifier.Display:
    case UnunuraIdentifier.DisplayExtended:
      return getResourceDisplay(identifier, ctx)
    case UnunuraIdentifier.Float:
    case UnunuraIdentifier.FloatExtended:
      return getResourceFloat(identifier, ctx)
    case UnunuraIdentifier.Transition:
    case UnunuraIdentifier.TransitionExtended:
      return getResourceTransition(identifier, ctx)
    case UnunuraIdentifier.Transform:
    case UnunuraIdentifier.TransformExtended:
      return getResourceTransform(identifier, ctx)
    case UnunuraIdentifier.Typography:
    case UnunuraIdentifier.TypographyExtended:
      return getResourceTypography(identifier, ctx)
    case UnunuraIdentifier.Style:
    case UnunuraIdentifier.StyleExtended:
      return getResourceStyle(identifier, ctx)
    case UnunuraIdentifier.Filter:
    case UnunuraIdentifier.FilterExtended:
      return getResourceFilter(identifier, ctx)
    case UnunuraIdentifier.Gradient:
    case UnunuraIdentifier.GradientExtended:
      return getResourceGradient(identifier, ctx)
    case UnunuraIdentifier.Animation:
    case UnunuraIdentifier.AnimationExtended:
      return getResourceAnimation(identifier, ctx)
    case UnunuraIdentifier.Collection:
    case UnunuraIdentifier.CollectionExtended:
      return getResourceCollection(identifier, ctx)
    case UnunuraIdentifier.Reset: //global
      return NULLABLE
    default:
      return NULLABLE
  }
}

export const resolveTitleCssClass = (identifier: UnunuraIdentifier, ctx: UnunuraGenerateContext): Nullable<string> => {
  const asTheme = asThemeInContext(ctx)
  const asResponsive = asResponsiveInContext(ctx)

  const resolvedIdentifier = getUniqueIdentifier(identifier)

  const buffered =
    asResponsive && asTheme
      ? ctx.buffer?.find((c) => c.startsWith(`.${asTheme} .${resolvedIdentifier}`))
      : asResponsive
      ? ctx.buffer?.find((c) => purgeOnlyCssClassTitle(c).startsWith(resolvedIdentifier))
      : undefined

  if (asResponsive && asTheme && !buffered) return NULLABLE
  if (asResponsive && !buffered) return NULLABLE

  let setter = !asResponsive
    ? ctx.contents.reduce(
        (sum, acc) => (sum += ctx.ununura?.simplifyTitles ? `` : `-${resolveTitleToClassName(acc)}`),
        (asTheme ? `.${asTheme} ` : '') + resolveHashTitle(`.${resolvedIdentifier}`, ctx)
      )
    : (asTheme && !asResponsive ? `.${asTheme} ` : '') +
      `.${purgeOnlyCssClassTitle(buffered as string, !!asTheme && !!asResponsive)}`
  setter += asTheme && !asResponsive ? `-${asTheme}` : ''
  setter += ctx.node?.flag ? `-${ctx.node?.flag}` : ''

  // TODO: unique generation in transform for remove only scopedInTemplate option.
  return ctx.ununura?.hashTitles && ctx.ununura.scopedInTemplate ? hashTitleResources(setter) : setter
}

export const resolveCssClass = (identifier: UnunuraIdentifier, setter: string, ctx: UnunuraGenerateContext): Nullable<string> => {
  const title = resolveTitleCssClass(identifier, ctx)

  if (isNullable(title)) return NULLABLE

  if (!setter.trim()) return NULLABLE

  const asPseudoClass = ctx.stack?.find((c) => isPseudoClassContextIdentifier(c))
  const asPseudoElement = ctx.stack?.find((c) => isPseudoElementContextIdentifier(c))
  const asResponsive = asResponsiveInContext(ctx)

  const head = `${title}${asPseudoElement ? `::${asPseudoElement}` : asPseudoClass ? `:${asPseudoClass}` : ''}`
  const cl = TemplateDefaultClass(head, setter)

  // @ts-expect-error
  if (asResponsive) return TemplateClassResponsive(ctx, asResponsive, cl)

  return cl
}
