export type ResolveMenuWidthOptions = {
  activatorWidth: number
  contentWidth: number
  explicitWidth?: number
  fitContent?: boolean
  fullWidth?: boolean
}

export const resolveMenuWidth = ({
  activatorWidth,
  contentWidth,
  explicitWidth,
  fitContent,
  fullWidth,
}: ResolveMenuWidthOptions): number => {
  if (fullWidth) return activatorWidth
  if (explicitWidth !== undefined) return explicitWidth
  if (fitContent) return contentWidth

  return Math.max(activatorWidth, contentWidth)
}