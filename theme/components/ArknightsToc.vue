<script setup lang="ts">
import { useOutline } from 'valaxy'
import { computed, ref } from 'vue'

const { headers, handleClick } = useOutline()

function flatten(entries: any[]): any[] {
  return entries.flatMap(entry => [entry, ...flatten(entry.children || [])])
}
const flatHeaders = computed(() => flatten(headers.value || []))

// 控制移动端抽屉的开关
const isMobileTocOpen = ref(false)

// 点击目录项后，自动关闭移动端抽屉
function handleLinkClick(e: Event, _link: string) {
  handleClick(e)
  isMobileTocOpen.value = false
}
</script>

<template>
  <!-- 移动端浮动按钮（仅在移动端显示） -->
  <button
    class="mobile-toc-toggle"
    aria-label="打开目录"
    @click="isMobileTocOpen = true"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
    <span>目录</span>
  </button>

  <!-- 移动端遮罩层 -->
  <div
    v-if="isMobileTocOpen"
    class="mobile-toc-overlay"
    @click="isMobileTocOpen = false"
  />

  <!-- 目录面板（桌面端是侧边栏，移动端是抽屉） -->
  <aside
    v-if="flatHeaders.length"
    class="custom-floating-toc" :class="[{ 'is-mobile-open': isMobileTocOpen }]"
  >
    <div class="toc-header">
      <div class="toc-title">
        本文目录
      </div>
      <!-- 移动端关闭按钮 -->
      <button class="mobile-toc-close" @click="isMobileTocOpen = false">
        ✕
      </button>
    </div>

    <ul class="toc-list">
      <li
        v-for="header in flatHeaders"
        :key="header.link"
        class="toc-item" :class="[`level-${header.level}`]"
      >
        <a
          :href="header.link"
          @click="(e) => handleLinkClick(e, header.link)"
        >
          {{ header.title }}
        </a>
      </li>
    </ul>
  </aside>
</template>

<style>
/* 1. 桌面端布局调整（保持之前的设计） */
.ark-reading-grid {
  max-width: 1400px !important;
  grid-template-columns: minmax(0, 1fr) 260px !important;
  gap: 80px !important;
}
</style>

<style scoped>
/* =========================================
   桌面端样式 (默认)
   ========================================= */
.custom-floating-toc {
  position: sticky;
  top: 100px;
  max-height: calc(100vh - 150px);
  overflow-y: auto;
  padding-left: 20px;
  border-left: 2px solid var(--vp-c-divider);
}

.toc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.toc-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--vp-c-text-1);
  letter-spacing: 1px;
}

/* 桌面端隐藏浮动按钮和关闭按钮 */
.mobile-toc-toggle,
.mobile-toc-close,
.mobile-toc-overlay {
  display: none;
}

/* 目录列表基础样式 */
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
  color: var(--vp-c-text-2);
  text-decoration: none;
  font-size: 13px;
  transition: color 0.2s;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.toc-item a:hover {
  color: var(--vp-c-brand-1);
}
.level-3 {
  padding-left: 14px;
}
.level-4 {
  padding-left: 28px;
}

/* =========================================
   移动端样式 (屏幕宽度 <= 1024px)
   ========================================= */
@media (max-width: 1024px) {
  /* 1. 让网格变成单列，隐藏桌面端侧边栏 */
  .ark-reading-grid {
    grid-template-columns: 1fr !important;
  }

  /* 2. 显示并固定浮动按钮 */
  .mobile-toc-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    position: fixed;
    bottom: 80px; /* 距离底部的位置，可以避开右下角的回到顶部按钮 */
    right: 20px;
    z-index: 100;
    padding: 10px 16px;
    background-color: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-divider);
    border-radius: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    color: var(--vp-c-text-1);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition:
      background-color 0.2s,
      transform 0.2s;
  }
  .mobile-toc-toggle:active {
    transform: scale(0.95);
  }

  /* 3. 遮罩层样式 */
  .mobile-toc-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    backdrop-filter: blur(2px);
  }

  /* 4. 目录抽屉本体（从底部滑出） */
  .custom-floating-toc {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    max-height: 70vh; /* 最多占屏幕高度的 70% */
    background-color: var(--vp-c-bg);
    z-index: 1000;
    padding: 20px 24px;
    border-left: none;
    border-top: 1px solid var(--vp-c-divider);
    border-radius: 16px 16px 0 0;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);

    /* 默认隐藏（向下平移），打开时滑入 */
    transform: translateY(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow-y: auto;
  }

  /* 打开状态 */
  .custom-floating-toc.is-mobile-open {
    transform: translateY(0);
  }

  /* 移动端显示关闭按钮 */
  .mobile-toc-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: var(--vp-c-default-soft);
    border: none;
    color: var(--vp-c-text-2);
    font-size: 16px;
    cursor: pointer;
  }

  /* 调整移动端目录项的点击热区，方便手指点按 */
  .toc-item {
    margin-bottom: 0;
  }
  .toc-item a {
    padding: 12px 0;
    font-size: 15px; /* 移动端字号稍微大一点 */
    border-bottom: 1px solid var(--vp-c-divider);
  }
  .toc-item:last-child a {
    border-bottom: none;
  }
}
</style>
