export type PatternType = 'spiral' | 'fractal' | 'wave' | 'circles' | 'voronoi' | 'noise'

export interface DesignParams {
  pattern: PatternType
  seed: number
  iterations: number
  scale: number
  rotation: number
  strokeWidth: number
  opacity: number
  bgColor: string
  palette: string[]
  width: number
  height: number
  useBrandColors: boolean
  brandPrimary: string
  brandSecondary: string
}

export interface ColorTheme {
  id: string
  name: string
  colors: string[]
}

export interface BrandPreset {
  id: string
  name: string
  primary: string
  secondary: string
  industry: string
}
