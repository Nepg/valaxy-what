<script setup lang="ts">
import { useOutline } from 'valaxy'
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
const { headers, handleClick } = useOutline()
const flatten = (entries: any[]): any[] => entries.flatMap(entry => [entry, ...flatten(entry.children || [])])
const flatHeaders = computed(() => flatten(headers.value || []))
const isOpen = ref(false)
const isAnimating = ref(false)
let scrollPosition = 0
const activeId = ref('')

// ✨ antd backtop：控制悬浮回到顶部显示
const showBackTop = ref(false)
const VISIBILITY_HEIGHT = 400 // 滚动超过400px显示，和antd默认一致
let scrollTimer: number | null = null

// 滚动监听 + 节流
function handleWindowScroll() {
  if (scrollTimer) return
  scrollTimer = window.requestAnimationFrame(() => {
    showBackTop.value = window.scrollY > VISIBILITY_HEIGHT
    scrollTimer = null
  })
}

// 统一处理打开逻辑
function openDrawer() {
  if (isOpen.value || isAnimating.value) return
  isAnimating.value = true
  scrollPosition = window.scrollY
  document.body.style.position = 'fixed'
  document.body.style.top = `-${scrollPosition}px`
  document.body.style.width = '100%'
  document.body.style.overflowY = 'scroll'
  isOpen.value = true
  setTimeout(() => { isAnimating.value = false }, 300)
}
// 统一处理关闭逻辑
function closeDrawer() {
  if (!isOpen.value || isAnimating.value) return
  isAnimating.value = true
  isOpen.value = false
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
  document.body.style.overflowY = ''
  window.scrollTo(0, scrollPosition)
  setTimeout(() => { isAnimating.value = false }, 300)
}
function handleLinkClick(e: Event, link: string) {
  handleClick(e)
  closeDrawer()
  activeId.value = link.replace('#', '')
}

// ✨ 悬浮按钮回顶（antd风格）
function handleBackToTop() {
  activeId.value = ''
  closeDrawer()
  window.scrollTo({ top: 0, behavior: 'instant' })
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) {
    closeDrawer()
  }
}

let observer: IntersectionObserver | null = null
const initObserver = () => {
  if (observer) observer.disconnect()
  nextTick(() => {
    const headings = Array.from(document.querySelectorAll('h2[id], h3[id], h4[id]'))
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeId.value = entry.target.id
          }
        })
      },
      {
        rootMargin: '0px 0px -80% 0px',
        threshold: 0
      }
    )
    headings.forEach((heading) => observer?.observe(heading))
  })
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('scroll', handleWindowScroll)
  initObserver()
  handleWindowScroll() // 初始化一次状态
})

watch(flatHeaders, () => {
  initObserver()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('scroll', handleWindowScroll)
  if (scrollTimer) cancelAnimationFrame(scrollTimer)
  if (observer) observer.disconnect()
  if (isOpen.value) {
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    document.body.style.overflowY = ''
  }
})
</script>
<template>
  <aside class="desktop-toc">
    <div class="toc-title"><span>//</span> 目录</div>
    <ul class="toc-list">
      <li
        v-for="header in flatHeaders"
        :key="header.link"
        class="toc-item"
        :class="[`level-${header.level}`, { 'is-active': activeId === header.link.replace('#', '') }]"
      >
        <a :href="header.link" @click="handleLinkClick($event, header.link)">{{ header.title }}</a>
      </li>
    </ul>
  </aside>

  <div class="mobile-toc-wrapper">
    <button class="mobile-toc-btn" @click="openDrawer">
     <svg class="ak-icon ak-icon--stroke" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="miter"><path d="M4 6h16M8 12h12M12 18h8"></path></svg>
    </button>
    <div v-if="isOpen" class="toc-overlay" @click="closeDrawer" />
    <aside class="mobile-toc-drawer" :class="[{ 'is-open': isOpen }]">
      <div class="toc-header">
        <div class="toc-title"><span>//</span> 目录</div>
        <button class="close-btn" @click="closeDrawer">✕</button>
      </div>
      <ul class="toc-list">
        <li
          v-for="header in flatHeaders"
          :key="header.link"
          class="toc-item"
          :class="[`level-${header.level}`, { 'is-active': activeId === header.link.replace('#', '') }]"
        >
          <a :href="header.link" @click="handleLinkClick($event, header.link)">{{ header.title }}</a>
        </li>
      </ul>
    </aside>
  </div>

  <!-- ✨ Ant Design 风格悬浮BackTop 右下角悬浮按钮 -->
  <button v-if="showBackTop" class="ant‑style‑backtop" @click="handleBackToTop">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m18 15-6-6-6 6"/>
    </svg>
  </button>
</template>

<style scoped>
.toc-title {
  font-family: var(--ak-font-mono); font-weight: 700; font-size: 13px; color: var(--ark-ink);
  margin-bottom: 16px; letter-spacing: 2px; display: flex; align-items: center; gap: 6px;
}
.toc-title span { color: var(--ark-accent); opacity: 0.8; }
.toc-list { list-style: none; padding: 0; margin: 0; }
.toc-item { position: relative; margin-bottom: 8px; line-height: 1.5; }
.toc-item a {
  font-family: var(--ark-font); color: var(--ark-muted); text-decoration: none; font-size: 13px;
  display: block; white-space: normal; word-break: break-all; line-height: 1.5;
  transition: all 0.3s ease; padding: 2px 0 4px 25px; position: relative;
}
.toc-item a::before {
  content: ''; position: absolute; left: 4px; top: 50%; transform: translateY(-50%);
  width: 4px; height: 1px; background-color: var(--ark-line); transition: all 0.3s ease;
}
.level-3 { padding-left: 36px; }
.level-4 { padding-left: 52px; }
.level-3 a::before { width: 10px; }
.level-4 a::before { width: 16px; }

.toc-item.is-active a {
  color: var(--ark-ink);
  font-weight: 600;
}
.toc-item.is-active a::before {
  width: 12px;
  background-color: var(--ark-accent);
}
.toc-item a:hover {
  color: var(--ark-ink);
}
.toc-item a:hover::before {
  width: 12px;
  background-color: var(--ark-accent);
}

.desktop-toc {
  position: sticky;
  top: 100px;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
  padding-left: 20px;
  border-left: 1px dashed var(--ark-line);
  align-self: start;
  will-change: transform;
  transition: top 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-toc-wrapper { display: none; }
@media (max-width: 1024px) {
  .desktop-toc { display: none; }
  .mobile-toc-wrapper { display: block; }
  .mobile-toc-btn {
    right: 48px;
    height: 44px; width: 44px; position: fixed; top: 100px; z-index: 100; padding: 0;
    display: flex; align-items: center; justify-content: center;
    background: var(--ark-surface); border: 1px solid var(--ark-line); color: var(--ark-ink);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); cursor: pointer;
  }

  .toc-overlay { position: fixed; inset: 0; background-color: transparent; z-index: 999; }
  .mobile-toc-drawer {
    position: fixed; top: 0; right: 0; bottom: 0; width: 280px; background-color: var(--ark-paper);
    z-index: 1000; padding: 0; display: flex; flex-direction: column;
    box-shadow: -8px 0 30px rgba(0, 0, 0, 0.15); border-left: 1px solid var(--ark-line);
    transform: translateX(100%); transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden; overscroll-behavior: contain;
  }
  .mobile-toc-drawer.is-open { transform: translateX(0); }
  .toc-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 24px 24px 16px; flex-shrink: 0; border-bottom: 1px solid var(--ark-line);
  }
  .close-btn {
    background: none; border: none; font-size: 18px; color: var(--ark-muted);
    cursor: pointer; padding: 4px; transition: color 0.2s;
  }
  .toc-list { flex: 1; overflow-y: auto; padding: 16px 24px; overscroll-behavior: contain; }
  .toc-item { margin-bottom: 12px; }
  .toc-item a { font-size: 14px; }
  .toc-item.is-active a::before {
    width: 10px;
  }
  .toc-item a:hover::before {
    width: 10px;
  }
}
@media (max-width: 1000px) { .mobile-toc-btn { right: 32px; } }
@media (max-width: 680px) { .mobile-toc-btn { right: 20px; } }

/* ============= Ant‑Design风格悬浮BackTop按钮 ============= */
.ant‑style‑backtop {
  position: fixed;
  bottom: 50px;   /* antd 默认距离底部50px */
  right: 15vw;    /* 距离右侧 */
  z-index: 90;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--ark-line);
  background-color: var(--ark-paper);
  color: var(--ark-ink);
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  /* 淡入动画 */
  opacity: 0;
  animation: backtopFadeIn 0.3s ease forwards;
  transition: background-color 0.3s ease, color 0.3s ease;
}
.ant‑style‑backtop:hover {
  background-color: var(--ark-surface);
  color: var(--ark-accent);
}

@keyframes backtopFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* 桌面端：宽屏（>1400px，内容居中） */
@media (min-width: 1401px) {
  .ant‑style‑backtop {
    right: auto;
    /* 内容左边缘 + 内容宽 - 目录宽 - 间距 - 按钮宽 - 间隙 */
    left: calc((100% - 1400px) / 2 + 1400px - 200px - 50px);
    bottom: 40px;
  }
}

/* 桌面端：窄屏（1025–1400px，内容贴边） */
@media (min-width: 1025px) and (max-width: 1400px) {
  .ant‑style‑backtop {
    right: auto;
    /* 视口右缘 - 目录宽 - 间距 - 按钮宽 - 间隙 */
    left: calc(100% - 200px);
    bottom: 40px;
  }
}

/* 移动端适配悬浮按钮位置 */
@media (max-width: 1024px) { .ant‑style‑backtop {     right: 48px; bottom: 40px; } }
@media (max-width: 1000px) { .ant‑style‑backtop {     right: 32px;} }
@media (max-width: 680px) { .ant‑style‑backtop { right: 20px; } }

</style>
