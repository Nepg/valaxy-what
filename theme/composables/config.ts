import type { ThemeConfig } from '../types'
import { useConfig, useSiteConfig } from 'valaxy'
import { computed } from 'vue'

export function useArknightsTheme() {
  const config = useConfig<ThemeConfig>()
  return computed(() => config.value.themeConfig)
}

const text = {
  zh: { menu: '打开导航', closeMenu: '关闭导航', navigation: '站点导航', docs: '主题文档', home: '首页', archive: '文章', about: '关于', appearance: '切换明暗模式', skip: '跳至内容', featured: '精选文章', read: '开始阅读', latest: '全部', all: '全部', search: '搜索文章标题', tags: '按标签筛选', results: '篇记录', empty: '没有找到匹配的记录。', reset: '清除筛选', outline: '本文目录', back: '返回', untitled: '无标题', noPosts: '记录，从这里开始。', noPostsText: ' ', notFound: '无', returnHome: '返回首页', published: '发布于' },
  en: { menu: 'Open navigation', closeMenu: 'Close navigation', navigation: 'Site navigation', docs: 'Theme guide', home: 'Home', archive: 'Archive', about: 'About', appearance: 'Toggle color scheme', skip: 'Skip to content', featured: 'Featured entry', read: 'Read the entry', latest: 'Latest entries', all: 'All', search: 'Search post titles', tags: 'Filter by tag', results: 'entries', empty: 'No matching entries.', reset: 'Clear filters', outline: 'On this page', back: 'Back to archive', untitled: 'Untitled', noPosts: 'Your field notes start here.', noPostsText: 'Write your first entry in pages/posts.', notFound: 'This entry has not arrived.', returnHome: 'Return home', published: 'Published' },
}
export function useArknightsText() {
  const site = useSiteConfig()
  return computed(() => site.value.lang.startsWith('zh') ? text.zh : text.en)
}
