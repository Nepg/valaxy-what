<script setup lang="ts">
import { useOutline } from 'valaxy'
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

const { headers, handleClick } = useOutline()
const flatten = (entries: any[]): any[] => entries.flatMap(entry => [entry, ...flatten(entry.children || [])])
const flatHeaders = computed(() => flatten(headers.value || []))

const isOpen = ref(false)
const isAnimating = ref(false)
let scrollPosition = 0

// 👇 新增：记录当前激活的标题 ID
const activeId = ref('')

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
  // 👇 点击时立即激活，不等滚动监听
  activeId.value = link.replace('#', '')
}

function handleBackToTop() {
  scrollPosition = 0
  closeDrawer()
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) {
    closeDrawer()
  }
}

// 👇 新增：滚动监听（雷达锁定）逻辑
let observer: IntersectionObserver | null = null

const initObserver = () => {
  if (observer) observer.disconnect()

  // 等待 DOM 渲染完毕后，获取文章内的所有标题
  nextTick(() => {
    // Valaxy 的文章内容通常在 markdown-body 或类似容器里，这里直接抓取所有带 id 的标题
    const headings = Array.from(document.querySelectorAll('h2[id], h3[id], h4[id]'))
    
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 当标题进入视口（或者进入视口顶部某个区域时）
          if (entry.isIntersecting) {
            activeId.value = entry.target.id
          }
        })
      },
      {
        rootMargin: '0px 0px -80% 0px', // 当标题滚动到屏幕顶部 20% 区域时触发
        threshold: 0
      }
    )

    headings.forEach((heading) => observer?.observe(heading))
  })
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  initObserver()
})

// 监听目录数据变化（比如切换文章时），重新初始化雷达
watch(flatHeaders, () => {
  initObserver()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
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
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 4H21V6H8V4ZM4.5 6.5C3.67157 6.5 3 5.82843 3 5C3 4.17157 3.67157 3.5 4.5 3.5C5.32843 3.5 6 4.17157 6 5C6 5.82843 5.32843 6.5 4.5 6.5ZM4.5 13.5C3.67157 13.5 3 12.8284 3 12C3 11.1716 3.67157 10.5 4.5 10.5C5.32843 10.5 6 11.1716 6 12C6 12.8284 5.32843 13.5 4.5 13.5ZM4.5 20.4C3.67157 20.4 3 19.7284 3 18.9C3 18.0716 3.67157 17.4 4.5 17.4C5.32843 17.4 6 18.0716 6 18.9C6 19.7284 5.32843 20.4 4.5 20.4ZM8 11H21V13H8V11ZM8 18H21V20H8V18Z" /></svg>
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
      <div class="back-to-top" @click="handleBackToTop">
        回到顶部
      </div>
    </aside>
  </div>
</template>

<style scoped>
/* ... 基础样式保持不变 ... */
.toc-title {
  font-family: var(--ak-font-mono); font-weight: 700; font-size: 13px; color: var(--ark-ink);
  margin-bottom: 16px; letter-spacing: 2px; display: flex; align-items: center; gap: 6px;
}
.toc-title span { color: var(--ark-accent); opacity: 0.8; }
.toc-list { list-style: none; padding: 0; margin: 0; }
.toc-item { position: relative; margin-bottom: 8px; line-height: 1.5; }

.toc-item a {
  font-family: var(--ark-font); color: var(--ark-muted); text-decoration: none; font-size: 13px;
  display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
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

/* 👇 核心新增：激活状态（雷达锁定）的样式 */
.toc-item.is-active a {
  color: var(--ark-ink); /* 文字变亮 */
  font-weight: 600; /* 微微加粗 */
}
.toc-item.is-active a::before {
  width: 14px; /* 线条拉长 */
  background-color: var(--ark-accent); /* 亮起战术蓝 */
}

/* Hover 仅作为辅助反馈，如果在激活状态下 Hover，保持激活样式 */
.toc-item a:hover {
  color: var(--ark-ink);
}
.toc-item a:hover::before {
  width: 16px; 
  background-color: var(--ark-accent);
}

/* ... 桌面端、移动端原有代码保持不变 ... */
.desktop-toc {
  position: sticky; top: 100px; max-height: calc(100vh - 160px);
  overflow-y: auto; padding-left: 20px; border-left: 1px dashed var(--ark-line);
}
.mobile-toc-wrapper { display: none; }

@media (max-width: 1024px) {
  .desktop-toc { display: none; }
  .mobile-toc-wrapper { display: block; }
  .mobile-toc-btn {
    height: 44px; width: 44px; position: fixed; top: 90px; z-index: 100; padding: 0;
    display: flex; align-items: center; justify-content: center;
    background: var(--ark-surface); border: 1px solid var(--ark-line); color: var(--ark-ink);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); cursor: pointer;
  }
  .toc-overlay { position: fixed; inset: 0; background-color: transparent; z-index: 999; }
  .mobile-toc-drawer {
    position: fixed; top: 0; right: 0; bottom: 0; width: 280px; background-color: var(--ark-paper);
    z-index: 1000; padding: 0; display: flex; flex-direction: column;
    box-shadow: -8px 0 30px rgba(0, 0, 0, 0.15); border-left: 1px solid var(--ark-line);
    transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
  .back-to-top {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 20px 24px; font-family: var(--ak-font-mono); letter-spacing: 2px;
    color: var(--ark-muted); font-size: 13px; font-weight: 600; cursor: pointer;
    border-top: 1px solid var(--ark-line); background-color: var(--ark-paper);
    flex-shrink: 0; transition: background-color 0.2s;
  }
  .back-to-top:hover { background-color: var(--ark-surface); }
}

@media (max-width: 1000px) { .mobile-toc-btn { right: 32px; } }
@media (max-width: 680px) { .mobile-toc-btn { right: 20px; } }
</style>