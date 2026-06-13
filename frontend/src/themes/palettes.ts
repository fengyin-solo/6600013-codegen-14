import type { ColorTheme, BrandPreset } from '../types'

export const THEMES: ColorTheme[] = [
  { id: 'sunset',  name: '日落',    colors: ['#ff6b35','#f7c59f','#efefd0','#004e89','#1a659e'] },
  { id: 'ocean',   name: '海洋',    colors: ['#05445e','#75e6da','#189ab4','#d4f1f9','#22577a'] },
  { id: 'neon',    name: '霓虹',    colors: ['#ff00ff','#00ffff','#ffff00','#ff6600','#66ff00'] },
  { id: 'forest',  name: '森林',    colors: ['#1b4332','#2d6a4f','#40916c','#52b788','#95d5b2'] },
  { id: 'mono',    name: '单色',    colors: ['#ffffff','#cccccc','#888888','#444444','#222222'] },
  { id: 'pastel',  name: '糖果',    colors: ['#ffadad','#ffd6a5','#caffbf','#9bf6ff','#bdb2ff'] },
  { id: 'fire',    name: '火焰',    colors: ['#ff0000','#ff6600','#ffcc00','#ff9900','#ff3300'] },
  { id: 'aurora',  name: '极光',    colors: ['#00ff87','#60efff','#0061ff','#c850c0','#ffcc70'] },
]

export const BRAND_PRESETS: BrandPreset[] = [
  { id: 'tech-blue',   name: '科技蓝', primary: '#0066FF', secondary: '#00D4FF', industry: '科技' },
  { id: 'startup-green', name: '创业绿', primary: '#10B981', secondary: '#34D399', industry: '创业' },
  { id: 'luxury-gold', name: '奢华金', primary: '#D4AF37', secondary: '#8B4513', industry: '奢侈品' },
  { id: 'energy-red',  name: '活力红', primary: '#EF4444', secondary: '#F97316', industry: '运动' },
  { id: 'creative-purple', name: '创意紫', primary: '#8B5CF6', secondary: '#EC4899', industry: '创意' },
  { id: 'calm-teal',   name: '宁静青', primary: '#14B8A6', secondary: '#06B6D4', industry: '健康' },
  { id: 'warm-orange', name: '温暖橙', primary: '#F97316', secondary: '#FBBF24', industry: '餐饮' },
  { id: 'trust-navy',  name: '信任蓝', primary: '#1E3A8A', secondary: '#3B82F6', industry: '金融' },
  { id: 'nature-green', name: '自然绿', primary: '#166534', secondary: '#84CC16', industry: '环保' },
  { id: 'playful-pink', name: '活泼粉', primary: '#EC4899', secondary: '#F472B6', industry: '时尚' },
  { id: 'professional-gray', name: '专业灰', primary: '#374151', secondary: '#6B7280', industry: '商务' },
  { id: 'bold-black',  name: '经典黑', primary: '#111827', secondary: '#F59E0B', industry: '高端' },
]
