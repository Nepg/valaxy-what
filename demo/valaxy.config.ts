import type { ThemeConfig } from 'valaxy-theme-arknights'
import { defineValaxyConfig } from 'valaxy'

export default defineValaxyConfig<ThemeConfig>({
  theme: 'arknights',
  themeConfig: {
    eyebrow: 'BORDERLAND / FIELD NOTES',
    motto: '在边界之外，记录日常。',
    nav: [{ text: '首页', link: '/' }],
    footer: '记录值得留下的事。',
  },
})
