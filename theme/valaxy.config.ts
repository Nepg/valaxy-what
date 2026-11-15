import type { ThemeConfig } from './types'
import { defineTheme } from 'valaxy'

export default defineTheme<ThemeConfig>({
  themeConfig: {
    eyebrow: 'PERSONAL FIELD NOTES',
    motto: 'Observe. Record. Share.',
    nav: [],
    accent: '#ffd84a',
    outline: 'deep',
    footer: '',
  },
})
