import process from 'node:process'
import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  lang: 'zh-CN',
  title: '边境手记',
  subtitle: '记录值得留下的事。',
  description: '在技术与生活的交界，写下观察、思考，\n和那些未曾命名的远方。',
  url: process.env.SITE_URL || 'https://arknights.valaxy.site/',
  author: { name: '记录者' },
  favicon: `${process.env.VITE_BASE || '/'}favicon.svg`,
  comment: { enable: false },
})
