import { useState } from 'react'
import { useDesignStore } from '../store/design'
import { THEMES, BRAND_PRESETS } from '../themes/palettes'
import type { PatternType } from '../types'
import { generateBrandPalette, generateFullBrandPalette, getContrastRatio, getContrastColor, generateMonochromaticScale, buildPatternPalette } from '../utils/colorUtils'

const PATTERNS: { value: PatternType; label: string }[] = [
  { value: 'spiral',  label: '🌀 螺旋' },
  { value: 'fractal', label: '🌳 分形树' },
  { value: 'wave',    label: '🌊 波浪' },
  { value: 'circles', label: '⭕ 圆环' },
  { value: 'voronoi', label: '🔷 泰森多边形' },
  { value: 'noise',   label: '🎲 噪声场' },
]

export default function Sidebar() {
  const store = useDesignStore()

  return (
    <div className="w-72 bg-gray-900 border-l border-gray-700 p-4 overflow-y-auto flex flex-col gap-4">
      <h2 className="text-lg font-bold">🎨 SVG 海报设计器</h2>

      {/* Pattern */}
      <div>
        <label className="text-xs text-gray-400 block mb-1">图案类型</label>
        <div className="grid grid-cols-2 gap-2">
          {PATTERNS.map(p => (
            <button key={p.value} onClick={() => store.setPattern(p.value)}
              className={`px-2 py-1.5 rounded text-xs font-medium ${store.pattern===p.value?'bg-indigo-600':'bg-gray-700 hover:bg-gray-600'}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div>
        <label className="text-xs text-gray-400 block mb-1">颜色主题</label>
        <div className="grid grid-cols-2 gap-2">
          {THEMES.map(t => (
            <button key={t.id} onClick={() => store.setTheme(t.id)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${!store.useBrandColors && store.palette.join(',') === t.colors.join(',') ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
              <div className="flex">{t.colors.map((c,i) => (
                <div key={i} style={{background:c}} className="w-3 h-3 rounded-full" />
              ))}</div>
              <span>{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Brand Colors */}
      <div className="bg-gray-800/50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-300">🎨 品牌色定制</label>
          <button
            onClick={() => store.toggleBrandColors(!store.useBrandColors)}
            className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${store.useBrandColors ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            {store.useBrandColors ? '✓ 已启用' : '启用'}
          </button>
        </div>

        {/* Brand Presets */}
        <div className="mb-3">
          <label className="text-xs text-gray-400 block mb-2">快速选择品牌预设</label>
          <div className="grid grid-cols-4 gap-1.5">
            {BRAND_PRESETS.map(preset => (
              <button
                key={preset.id}
                onClick={() => store.setBrandColors(preset.primary, preset.secondary)}
                className={`group relative flex flex-col items-center p-1.5 rounded-lg transition-all ${
                  store.brandPrimary === preset.primary && store.brandSecondary === preset.secondary && store.useBrandColors
                    ? 'bg-indigo-600/30 ring-2 ring-indigo-500'
                    : 'bg-gray-700/50 hover:bg-gray-700'
                }`}
                title={`${preset.name} - ${preset.industry}`}
              >
                <div className="flex gap-0.5 mb-1">
                  <div style={{ backgroundColor: preset.primary }} className="w-4 h-4 rounded-full shadow-inner" />
                  <div style={{ backgroundColor: preset.secondary }} className="w-4 h-4 rounded-full shadow-inner" />
                </div>
                <span className="text-[10px] text-gray-400 group-hover:text-gray-300 truncate w-full text-center">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Color Inputs */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xs text-gray-400 block mb-1.5">主色调</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={store.brandPrimary}
                onChange={e => store.setBrandColors(e.target.value, store.brandSecondary)}
                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-2 border-gray-600 hover:border-indigo-500 transition-colors"
              />
              <input
                type="text"
                value={store.brandPrimary}
                onChange={e => {
                  const val = e.target.value
                  if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                    store.setBrandColors(val, store.brandSecondary)
                  }
                }}
                className="flex-1 px-2 py-1.5 text-xs bg-gray-700 rounded-lg border border-gray-600 focus:border-indigo-500 focus:outline-none font-mono"
                placeholder="#000000"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1.5">辅助色调</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={store.brandSecondary}
                onChange={e => store.setBrandColors(store.brandPrimary, e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-2 border-gray-600 hover:border-indigo-500 transition-colors"
              />
              <input
                type="text"
                value={store.brandSecondary}
                onChange={e => {
                  const val = e.target.value
                  if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                    store.setBrandColors(store.brandPrimary, val)
                  }
                }}
                className="flex-1 px-2 py-1.5 text-xs bg-gray-700 rounded-lg border border-gray-600 focus:border-indigo-500 focus:outline-none font-mono"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>

        {/* Generated Palette Preview */}
        <div className="mb-3">
          <label className="text-xs text-gray-400 block mb-2">生成的完整配色方案</label>
          <BrandPalettePreview primary={store.brandPrimary} secondary={store.brandSecondary} pattern={store.pattern} />
        </div>

        {/* Color Info */}
        <div className="bg-gray-700/30 rounded-lg p-2 text-xs text-gray-400">
          <div className="flex items-center justify-between mb-1">
            <span>对比度 (主/辅):</span>
            <span className={`font-mono ${getContrastRatio(store.brandPrimary, store.brandSecondary) >= 4.5 ? 'text-green-400' : 'text-yellow-400'}`}>
              {getContrastRatio(store.brandPrimary, store.brandSecondary).toFixed(2)}:1
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>配色和谐度:</span>
            <span className="text-indigo-400">自动优化中</span>
          </div>
        </div>
      </div>

      {/* Seed */}
      <div>
        <label className="text-xs text-gray-400">种子: {store.seed}</label>
        <div className="flex gap-2 mt-1">
          <input type="range" min={0} max={99999} value={store.seed}
            onChange={e => store.setParam('seed', Number(e.target.value))} className="flex-1 accent-indigo-500" />
          <button onClick={() => store.randomSeed()} className="px-2 bg-indigo-600 rounded text-xs">🎲</button>
        </div>
      </div>

      {/* Iterations */}
      <div>
        <label className="text-xs text-gray-400">迭代数: {store.iterations}</label>
        <input type="range" min={10} max={500} step={10} value={store.iterations}
          onChange={e => store.setParam('iterations', Number(e.target.value))} className="w-full accent-purple-500" />
      </div>

      {/* Scale */}
      <div>
        <label className="text-xs text-gray-400">缩放: {store.scale.toFixed(2)}</label>
        <input type="range" min={0.1} max={3} step={0.1} value={store.scale}
          onChange={e => store.setParam('scale', Number(e.target.value))} className="w-full accent-green-500" />
      </div>

      {/* Rotation */}
      <div>
        <label className="text-xs text-gray-400">旋转: {store.rotation}°</label>
        <input type="range" min={0} max={360} step={5} value={store.rotation}
          onChange={e => store.setParam('rotation', Number(e.target.value))} className="w-full accent-yellow-500" />
      </div>

      {/* Stroke */}
      <div>
        <label className="text-xs text-gray-400">描边: {store.strokeWidth.toFixed(1)}</label>
        <input type="range" min={0.5} max={5} step={0.5} value={store.strokeWidth}
          onChange={e => store.setParam('strokeWidth', Number(e.target.value))} className="w-full accent-orange-500" />
      </div>

      {/* Opacity */}
      <div>
        <label className="text-xs text-gray-400">透明度: {store.opacity.toFixed(2)}</label>
        <input type="range" min={0.1} max={1} step={0.05} value={store.opacity}
          onChange={e => store.setParam('opacity', Number(e.target.value))} className="w-full accent-pink-500" />
      </div>

      {/* Export */}
      <div className="flex gap-2 mt-2">
        <button onClick={() => store.exportSvg()} className="flex-1 py-2 bg-teal-600 rounded text-sm font-medium hover:bg-teal-500 transition-colors">⬇ SVG</button>
        <button onClick={() => store.exportPng()} className="flex-1 py-2 bg-rose-600 rounded text-sm font-medium hover:bg-rose-500 transition-colors">⬇ PNG</button>
      </div>
    </div>
  )
}

function BrandPalettePreview({ primary, secondary, pattern }: { primary: string; secondary: string; pattern: string }) {
  const [copied, setCopied] = useState<string | null>(null)
  const palette = generateFullBrandPalette(primary, secondary)
  const patternPalette = buildPatternPalette(primary, secondary, pattern)
  const primaryScale = generateMonochromaticScale(primary, 5)
  const secondaryScale = generateMonochromaticScale(secondary, 5)

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color)
    setCopied(color)
    setTimeout(() => setCopied(null), 1500)
  }

  const colorGroups = [
    { label: '主色系', colors: [palette.primaryDark, palette.primary, palette.primaryLight] },
    { label: '辅色系', colors: [palette.secondaryDark, palette.secondary, palette.secondaryLight] },
    { label: '强调色', colors: [palette.accent, palette.accent2] },
    { label: '中性色', colors: palette.neutral },
  ]

  const gradientCss = `linear-gradient(135deg, ${palette.gradientStops.join(', ')})`

  return (
    <div className="space-y-3">
      <div
        className="rounded-lg p-3 relative overflow-hidden"
        style={{ backgroundColor: palette.background }}
      >
        <div className="flex items-center justify-between mb-2">
          <span style={{ color: palette.textPrimary }} className="text-xs font-semibold">背景预览</span>
          <span style={{ color: palette.textSecondary }} className="text-[10px]">自动对比度优化</span>
        </div>
        <div style={{ color: palette.textPrimary }} className="text-sm font-medium mb-1">标题文字示例</div>
        <div style={{ color: palette.textSecondary }} className="text-[11px]">次要文字内容展示效果</div>
        <div className="absolute top-2 right-2 flex gap-1">
          <div style={{ backgroundColor: palette.surface }} className="w-6 h-6 rounded shadow-md" />
        </div>
      </div>

      <div className="h-6 rounded-lg shadow-inner" style={{ background: gradientCss }} title="品牌渐变色" />

      <div>
        <label className="text-[10px] text-gray-500 block mb-1">当前图案配色适配 ({pattern})</label>
        <div className="flex rounded-lg overflow-hidden border border-gray-600/50 shadow-inner">
          {patternPalette.map((color, i) => (
            <button
              key={i}
              onClick={() => copyToClipboard(color)}
              className="group relative flex-1 h-8 transition-all hover:scale-y-125 hover:z-10"
              style={{ backgroundColor: color }}
              title={`点击复制: ${color}`}
            >
              {copied === color && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap z-20">
                  已复制
                </span>
              )}
              <span
                className="absolute inset-0 flex items-center justify-center text-[8px] font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: getContrastColor(color) }}
              >
                {i < 4 ? '主' : i < 7 ? '次' : '点'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {colorGroups.map((group, gi) => (
        <div key={gi} className="flex items-center gap-1.5">
          <span className="text-[10px] text-gray-500 w-12 shrink-0">{group.label}</span>
          <div className="flex gap-1 flex-1">
            {group.colors.map((color, ci) => (
              <button
                key={ci}
                onClick={() => copyToClipboard(color)}
                className="group relative flex-1 h-7 rounded-md transition-all hover:scale-110 hover:z-10 hover:shadow-lg border border-gray-600/50"
                style={{ backgroundColor: color }}
                title={`点击复制: ${color}`}
              >
                {copied === color && (
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap z-20">
                    已复制
                  </span>
                )}
                <span
                  className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[8px] font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: getContrastColor(color) }}
                >
                  {color.toUpperCase().slice(1)}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-gray-500 block mb-1">主色明度阶</label>
          <div className="flex rounded overflow-hidden border border-gray-600/50">
            {primaryScale.map((color, i) => (
              <button
                key={i}
                onClick={() => copyToClipboard(color)}
                className="flex-1 h-6 hover:scale-y-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
        <div>
          <label className="text-[10px] text-gray-500 block mb-1">辅色明度阶</label>
          <div className="flex rounded overflow-hidden border border-gray-600/50">
            {secondaryScale.map((color, i) => (
              <button
                key={i}
                onClick={() => copyToClipboard(color)}
                className="flex-1 h-6 hover:scale-y-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex rounded-lg overflow-hidden border border-gray-600/50 shadow-inner">
        {palette.allColors.map((color, i) => (
          <div
            key={i}
            style={{ backgroundColor: color }}
            className="flex-1 h-6 first:rounded-l-lg last:rounded-r-lg"
            title={color}
          />
        ))}
      </div>

      <p className="text-[10px] text-gray-500 text-center">
        💡 点击色块复制色值 · 不同图案自动适配配色权重
      </p>
    </div>
  )
}
