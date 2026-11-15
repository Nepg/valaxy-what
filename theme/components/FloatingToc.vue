<script setup lang="ts">
import { useOutline } from 'valaxy'
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

const { headers, handleClick } = useOutline()
const flatten = (entries: any[]): any[] => entries.flatMap(entry => [entry, ...flatten(entry.children || [])])
const flatHeaders = computed(() => flatten(headers.value || []))

const isOpen = ref(false)
const isAnimating = ref(false) // 用于防止动画期间重复点击
let scrollPosition = 0 // 记录打开前的滚动位置

// 统一处理打开逻辑
function openDrawer() {
  if (isOpen.value || isAnimating.value) return
  isAnimating.value = true
  
  // 1. 记录当前滚动位置
  scrollPosition = window.scrollY
  
  // 2. 锁死 body 并固定位置，防止高度坍缩和宽度抖动
  document.body.style.position = 'fixed'
  document.body.style.top = `-${scrollPosition}px`
  document.body.style.width = '100%'
  document.body.style.overflowY = 'scroll' // 保持右侧滚动条占位（部分浏览器有效）
  
  isOpen.value = true
  
  setTimeout(() => {
    isAnimating.value = false
  }, 300) // 与 CSS 过渡动画时间保持一致
}

// 统一处理关闭逻辑（遮罩、按钮、Esc、链接点击都走这里）
function closeDrawer() {
  if (!isOpen.value || isAnimating.value) return
  isAnimating.value = true
  isOpen.value = false
  
  // 1. 还原 body 样式
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
  document.body.style.overflowY = ''
  
  // 2. 瞬间还原滚动位置（没有平滑滚动，直接归位）
  window.scrollTo(0, scrollPosition)
  
  setTimeout(() => {
    isAnimating.value = false
  }, 300)
}

function handleLinkClick(e: Event) {
  handleClick(e)
  closeDrawer()
}

// 监听 Esc 键关闭
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) {
    closeDrawer()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  // 防止组件销毁时还在锁死状态
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
    <div class="toc-title">目录</div>
    <ul class="toc-list">
      <li v-for="header in flatHeaders" :key="header.link" class="toc-item" :class="[`level-${header.level}`]">
        <a :href="header.link" @click="handleLinkClick">{{ header.title }}</a>
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
        <div class="toc-title">本文目录</div>
        <button class="close-btn" @click="closeDrawer">✕</button>
      </div>
      <ul class="toc-list">
        <li v-for="header in flatHeaders" :key="header.link" class="toc-item" :class="[`level-${header.level}`]">
          <a :href="header.link" @click="handleLinkClick">{{ header.title }}</a>
        </li>
      </ul>
    </aside>
  </div>
</template>

<style scoped>
/* 基础样式 */
.toc-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--ark-ink);
  margin-bottom: 16px;
  letter-spacing: 1px;
}
.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.toc-item {
  margin-bottom: 10px;
  line-height: 1.5;
}
.toc-item a {
  color: var(--ark-muted);
  text-decoration: none;
  font-size: 13px;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s;
}
.toc-item a:hover {
  color: var(--ark-accent);
}
.level-3 { padding-left: 14px; }
.level-4 { padding-left: 28px; }

/* ================= 桌面端 ================= */
.desktop-toc {
  position: sticky;
  top: 100px;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
  padding-left: 20px;
}
.mobile-toc-wrapper { display: none; }

/* ================= 移动端及窄屏 ================= */
@media (max-width: 1024px) {
  .desktop-toc { display: none; }
  .mobile-toc-wrapper { display: block; }

  .mobile-toc-btn {
    height: 44px;
    width: 44px;
    position: fixed;
    top: 90px;
    z-index: 100;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--ark-surface);
    border: 1px solid var(--ark-line);
    color: var(--ark-ink);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }

  .toc-overlay {
    position: fixed; inset: 0; background-color: transparent; z-index: 999;
  }

  .mobile-toc-drawer {
    position: fixed;
    top: 0; right: 0; bottom: 0;
    width: 260px;
    background-color: var(--ark-paper);
    z-index: 1000;
    padding: 24px;
    box-shadow: -8px 0 30px rgba(0, 0, 0, 0.15); 
    border-left: 1px solid var(--ark-line);
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow-y: auto;
    
    /* 👇 核心魔法：当抽屉内部滚动到底部/顶部时，阻止滚动链传递给底层 body */
    overscroll-behavior: contain; 
  }

  .mobile-toc-drawer.is-open {
    transform: translateX(0);
  }

  .toc-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 18px;
    color: var(--ark-muted);
    cursor: pointer;
    padding: 4px;
    transition: color 0.2s;
  }
  .close-btn:hover { color: var(--ark-ink); }

  .toc-item { margin-bottom: 0; }
  .toc-item a {
    padding: 12px 0;
    font-size: 15px;
  }
}

@media (max-width: 1000px) { .mobile-toc-btn { right: 32px; } }
@media (max-width: 680px) { .mobile-toc-btn { right: 20px; } }
</style>