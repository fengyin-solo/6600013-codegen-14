export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  }
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }
  return { h: h * 360, s: s * 100, l: l * 100 }
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360; s /= 100; l /= 100
  let r, g, b
  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
}

export function lightenColor(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex)
  const { h, s, l } = rgbToHsl(r, g, b)
  const newL = Math.min(100, l + amount)
  const rgb = hslToRgb(h, s, newL)
  return rgbToHex(rgb.r, rgb.g, rgb.b)
}

export function darkenColor(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex)
  const { h, s, l } = rgbToHsl(r, g, b)
  const newL = Math.max(0, l - amount)
  const rgb = hslToRgb(h, s, newL)
  return rgbToHex(rgb.r, rgb.g, rgb.b)
}

export function saturateColor(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex)
  const { h, s, l } = rgbToHsl(r, g, b)
  const newS = Math.min(100, s + amount)
  const rgb = hslToRgb(h, newS, l)
  return rgbToHex(rgb.r, rgb.g, rgb.b)
}

export function desaturateColor(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex)
  const { h, s, l } = rgbToHsl(r, g, b)
  const newS = Math.max(0, s - amount)
  const rgb = hslToRgb(h, newS, l)
  return rgbToHex(rgb.r, rgb.g, rgb.b)
}

export function shiftHue(hex: string, degrees: number): string {
  const { r, g, b } = hexToRgb(hex)
  const { h, s, l } = rgbToHsl(r, g, b)
  const newH = (h + degrees + 360) % 360
  const rgb = hslToRgb(newH, s, l)
  return rgbToHex(rgb.r, rgb.g, rgb.b)
}

export function getLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex)
  const [rs, gs, bs] = [r, g, b].map(c => {
    c /= 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1)
  const l2 = getLuminance(hex2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export function ensureContrast(foreground: string, background: string, minRatio: number = 4.5): string {
  let ratio = getContrastRatio(foreground, background)
  let result = foreground
  let attempts = 0
  
  while (ratio < minRatio && attempts < 20) {
    const bgLuminance = getLuminance(background)
    if (bgLuminance > 0.5) {
      result = darkenColor(result, 5)
    } else {
      result = lightenColor(result, 5)
    }
    ratio = getContrastRatio(result, background)
    attempts++
  }
  
  return result
}

export function generateAnalogous(hex: string, count: number = 3): string[] {
  const { r, g, b } = hexToRgb(hex)
  const { h, s, l } = rgbToHsl(r, g, b)
  const colors: string[] = []
  const step = 30
  
  for (let i = 0; i < count; i++) {
    const offset = (i - Math.floor(count / 2)) * step
    const newH = (h + offset + 360) % 360
    const rgb = hslToRgb(newH, s, l)
    colors.push(rgbToHex(rgb.r, rgb.g, rgb.b))
  }
  
  return colors
}

export function generateComplementary(hex: string): string {
  return shiftHue(hex, 180)
}

export function generateSplitComplementary(hex: string): string[] {
  const { r, g, b } = hexToRgb(hex)
  const { h, s, l } = rgbToHsl(r, g, b)
  const colors: string[] = [hex]
  
  for (const offset of [150, 210]) {
    const newH = (h + offset) % 360
    const rgb = hslToRgb(newH, s, l)
    colors.push(rgbToHex(rgb.r, rgb.g, rgb.b))
  }
  
  return colors
}

export function generateTriadic(hex: string): string[] {
  const { r, g, b } = hexToRgb(hex)
  const { h, s, l } = rgbToHsl(r, g, b)
  const colors: string[] = []
  
  for (let i = 0; i < 3; i++) {
    const newH = (h + i * 120) % 360
    const rgb = hslToRgb(newH, s, l)
    colors.push(rgbToHex(rgb.r, rgb.g, rgb.b))
  }
  
  return colors
}

export function generateTints(hex: string, count: number = 5): string[] {
  const colors: string[] = []
  const step = 100 / (count + 1)
  
  for (let i = 1; i <= count; i++) {
    colors.push(lightenColor(hex, step * i))
  }
  
  return colors
}

export function generateShades(hex: string, count: number = 5): string[] {
  const colors: string[] = []
  const step = 100 / (count + 1)
  
  for (let i = 1; i <= count; i++) {
    colors.push(darkenColor(hex, step * i))
  }
  
  return colors
}

export function generateNeutrals(base: string, count: number = 5): string[] {
  const { r, g, b } = hexToRgb(base)
  const { h, s } = rgbToHsl(r, g, b)
  const lowSat = Math.max(5, s * 0.15)
  const colors: string[] = []
  const lightStep = 100 / (count + 1)
  
  for (let i = 1; i <= count; i++) {
    const rgb = hslToRgb(h, lowSat, lightStep * i)
    colors.push(rgbToHex(rgb.r, rgb.g, rgb.b))
  }
  
  return colors
}

export interface BrandPalette {
  primary: string
  primaryLight: string
  primaryDark: string
  secondary: string
  secondaryLight: string
  secondaryDark: string
  accent: string
  accent2: string
  neutral: string[]
  background: string
  surface: string
  textPrimary: string
  textSecondary: string
  allColors: string[]
  primaryTints: string[]
  secondaryTints: string[]
  gradientStops: string[]
}

export type BrandColorRole =
  | 'primary'
  | 'primaryLight'
  | 'primaryDark'
  | 'secondary'
  | 'secondaryLight'
  | 'secondaryDark'
  | 'accent'
  | 'accent2'
  | 'neutral'

export interface PatternColorStrategy {
  dominant: BrandColorRole[]
  secondary: BrandColorRole[]
  accent: BrandColorRole[]
}

export function generateBrandPalette(primary: string, secondary: string): string[] {
  const palette = generateFullBrandPalette(primary, secondary)
  return palette.allColors
}

export function generateFullBrandPalette(primary: string, secondary: string): BrandPalette {
  const primaryRgb = hexToRgb(primary)
  const secondaryRgb = hexToRgb(secondary)
  const primaryHsl = rgbToHsl(primaryRgb.r, primaryRgb.g, primaryRgb.b)
  const secondaryHsl = rgbToHsl(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b)

  const primaryLight = lightenColor(primary, 25)
  const primaryDark = darkenColor(primary, 20)
  
  const secondaryLight = lightenColor(secondary, 25)
  const secondaryDark = darkenColor(secondary, 20)

  const midHue = (primaryHsl.h + secondaryHsl.h) / 2
  const midSat = Math.max((primaryHsl.s + secondaryHsl.s) / 2, 40)
  const midLight = (primaryHsl.l + secondaryHsl.l) / 2
  const midRgb = hslToRgb(midHue, midSat, midLight)
  const accent = rgbToHex(midRgb.r, midRgb.g, midRgb.b)

  const complementHue = (primaryHsl.h + 180) % 360
  const complementRgb = hslToRgb(complementHue, Math.max(primaryHsl.s, secondaryHsl.s) * 0.8, (primaryHsl.l + secondaryHsl.l) / 2)
  const accent2 = rgbToHex(complementRgb.r, complementRgb.g, complementRgb.b)

  const neutrals = generateNeutrals(primary, 3)
  const primaryTints = generateTints(primary, 4)
  const secondaryTints = generateTints(secondary, 4)

  const bgLight = primaryHsl.l > 50 ? 8 : 92
  const bgSat = Math.max(5, primaryHsl.s * 0.3)
  const bgRgb = hslToRgb(primaryHsl.h, bgSat, bgLight)
  const background = rgbToHex(bgRgb.r, bgRgb.g, bgRgb.b)

  const surfaceLight = primaryHsl.l > 50 ? 15 : 85
  const surfaceRgb = hslToRgb(primaryHsl.h, bgSat * 1.5, surfaceLight)
  const surface = rgbToHex(surfaceRgb.r, surfaceRgb.g, surfaceRgb.b)

  const textPrimary = getContrastColor(background)
  const textSecondary = ensureContrast(
    primaryHsl.l > 50 ? darkenColor(background, 15) : lightenColor(background, 15),
    background,
    4.5
  )

  const gradientStops = [
    primaryDark,
    primary,
    primaryLight,
    accent,
    secondaryLight,
    secondary,
    secondaryDark,
  ]

  const allColors = [
    primary,
    primaryLight,
    secondary,
    accent,
    primaryDark,
    secondaryLight,
    accent2,
    secondaryDark,
    ...neutrals
  ].slice(0, 9)

  return {
    primary,
    primaryLight,
    primaryDark,
    secondary,
    secondaryLight,
    secondaryDark,
    accent,
    accent2,
    neutral: neutrals,
    background,
    surface,
    textPrimary,
    textSecondary,
    allColors,
    primaryTints,
    secondaryTints,
    gradientStops,
  }
}

export function getColorByRole(palette: BrandPalette, role: BrandColorRole): string {
  switch (role) {
    case 'primary': return palette.primary
    case 'primaryLight': return palette.primaryLight
    case 'primaryDark': return palette.primaryDark
    case 'secondary': return palette.secondary
    case 'secondaryLight': return palette.secondaryLight
    case 'secondaryDark': return palette.secondaryDark
    case 'accent': return palette.accent
    case 'accent2': return palette.accent2
    case 'neutral': return palette.neutral[0]
    default: return palette.primary
  }
}

const PATTERN_STRATEGIES: Record<string, PatternColorStrategy> = {
  spiral: {
    dominant: ['primary', 'primaryDark'],
    secondary: ['secondary', 'secondaryDark'],
    accent: ['accent', 'primaryLight', 'secondaryLight'],
  },
  fractal: {
    dominant: ['primaryDark', 'primary'],
    secondary: ['secondary', 'secondaryDark'],
    accent: ['accent', 'primaryLight', 'accent2'],
  },
  wave: {
    dominant: ['primary', 'secondary'],
    secondary: ['primaryLight', 'secondaryLight', 'accent'],
    accent: ['primaryDark', 'secondaryDark', 'accent2'],
  },
  circles: {
    dominant: ['primary', 'secondary', 'accent'],
    secondary: ['primaryLight', 'secondaryLight'],
    accent: ['primaryDark', 'secondaryDark', 'accent2'],
  },
  voronoi: {
    dominant: ['primary', 'secondary'],
    secondary: ['primaryLight', 'secondaryLight', 'accent'],
    accent: ['primaryDark', 'secondaryDark', 'accent2'],
  },
  noise: {
    dominant: ['primary', 'secondary', 'accent'],
    secondary: ['primaryLight', 'secondaryLight', 'accent2'],
    accent: ['primaryDark', 'secondaryDark'],
  },
}

export function buildPatternPalette(
  primary: string,
  secondary: string,
  patternType: string,
  colorCount: number = 9
): string[] {
  const palette = generateFullBrandPalette(primary, secondary)
  const strategy = PATTERN_STRATEGIES[patternType] || PATTERN_STRATEGIES.spiral

  const result: string[] = []
  const dominantCount = Math.ceil(colorCount * 0.4)
  const secondaryCount = Math.ceil(colorCount * 0.35)
  const accentCount = colorCount - dominantCount - secondaryCount

  for (let i = 0; i < dominantCount; i++) {
    const role = strategy.dominant[i % strategy.dominant.length]
    result.push(getColorByRole(palette, role))
  }
  for (let i = 0; i < secondaryCount; i++) {
    const role = strategy.secondary[i % strategy.secondary.length]
    result.push(getColorByRole(palette, role))
  }
  for (let i = 0; i < accentCount; i++) {
    const role = strategy.accent[i % strategy.accent.length]
    result.push(getColorByRole(palette, role))
  }

  return result.slice(0, colorCount)
}

export function blendColors(hex1: string, hex2: string, ratio: number): string {
  const c1 = hexToRgb(hex1)
  const c2 = hexToRgb(hex2)
  const r = Math.round(c1.r * (1 - ratio) + c2.r * ratio)
  const g = Math.round(c1.g * (1 - ratio) + c2.g * ratio)
  const b = Math.round(c1.b * (1 - ratio) + c2.b * ratio)
  return rgbToHex(r, g, b)
}

export function generateMonochromaticScale(hex: string, count: number = 7): string[] {
  const { r, g, b } = hexToRgb(hex)
  const { h, s } = rgbToHsl(r, g, b)
  const colors: string[] = []
  const step = 80 / (count - 1)
  for (let i = 0; i < count; i++) {
    const l = 10 + step * i
    const rgb = hslToRgb(h, s, l)
    colors.push(rgbToHex(rgb.r, rgb.g, rgb.b))
  }
  return colors
}

export function getContrastColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

export function generateBgFromPrimary(primary: string): string {
  const { r, g, b } = hexToRgb(primary)
  const { h, s, l } = rgbToHsl(r, g, b)
  const bgLight = l > 50 ? 8 : 92
  const bgSat = Math.max(5, s * 0.3)
  const bgRgb = hslToRgb(h, bgSat, bgLight)
  return rgbToHex(bgRgb.r, bgRgb.g, bgRgb.b)
}
