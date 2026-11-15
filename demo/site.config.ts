import process from 'node:process'
import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  lang: 'zh-CN',
  title: 'What can I say ?',
  subtitle: '记录值得留下的事。',
  description: ' ',
  url: process.env.SITE_URL || 'https://arknights.valaxy.site/',
  author: { name: '记录者' },
  favicon: `${process.env.VITE_BASE || '/'}favicon.svg`,
  comment: { enable: false },
})
