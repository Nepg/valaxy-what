<script setup lang="ts">
import { useOutline } from 'valaxy'
import { computed, ref } from 'vue'

const { headers, handleClick } = useOutline()
const flatten = (entries: any[]): any[] => entries.flatMap(entry => [entry, ...flatten(entry.children || [])])
const flatHeaders = computed(() => flatten(headers.value || []))

const isOpen = ref(false)

function handleLinkClick(e: Event) {
  handleClick(e)
  isOpen.value = false
}
</script>

<template>
  <!-- 桌面端：正常列在右边 -->
  <aside class="desktop-toc">
    <div class="toc-title">
      本文目录
    </div>
    <ul class="toc-list">
      <li v-for="header in flatHeaders" :key="header.link" class="toc-item" :class="[`level-${header.level}`]">
        <a :href="header.link" @click="handleLinkClick">{{ header.title }}</a>
      </li>
    </ul>
  </aside>

  <!-- 移动端：右上角固定按钮 + 侧滑抽屉 -->
  <div class="mobile-toc-wrapper">
    <button class="mobile-toc-btn" @click="isOpen = true">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 4H21V6H8V4ZM4.5 6.5C3.67157 6.5 3 5.82843 3 5C3 4.17157 3.67157 3.5 4.5 3.5C5.32843 3.5 6 4.17157 6 5C6 5.82843 5.32843 6.5 4.5 6.5ZM4.5 13.5C3.67157 13.5 3 12.8284 3 12C3 11.1716 3.67157 10.5 4.5 10.5C5.32843 10.5 6 11.1716 6 12C6 12.8284 5.32843 13.5 4.5 13.5ZM4.5 20.4C3.67157 20.4 3 19.7284 3 18.9C3 18.0716 3.67157 17.4 4.5 17.4C5.32843 17.4 6 18.0716 6 18.9C6 19.7284 5.32843 20.4 4.5 20.4ZM8 11H21V13H8V11ZM8 18H21V20H8V18Z" /></svg>
    </button>

    <!-- 遮罩层 -->
    <div v-if="isOpen" class="toc-overlay" @click="isOpen = false" />

    <!-- 右侧抽屉 -->
    <aside class="mobile-toc-drawer" :class="[{ 'is-open': isOpen }]">
      <div class="toc-header">
        <div class="toc-title">
          本文目录
        </div>
        <button class="close-btn" @click="isOpen = false">
          ✕
        </button>
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
  color: var(--vp-c-text-1);
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
  color: var(--vp-c-text-2);
  text-decoration: none;
  font-size: 13px;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

/* ================= 桌面端 ================= */
.desktop-toc {
  position: sticky;
  top: 100px;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
  padding-left: 20px;
  border-left: 2px solid var(--vp-c-divider);
}
.mobile-toc-wrapper {
  display: none;
}

/* ================= 移动端及窄屏 ================= */
@media (max-width: 1024px) {
  .desktop-toc {
    display: none;
  }
  .mobile-toc-wrapper {
    display: block;
  }

  /* 固定在右上角的按钮 */
  .mobile-toc-btn {
    height: 44px;
    width: 44px;
    position: fixed;
    top: 90px; /* 高度建议和导航栏保持在同一水平线 */
    z-index: 100;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: 1px solid var(--ark-line);
    color: var(--vp-c-text-1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
}

/* 当屏幕 <= 1000px 时，shell 左右各留白了 32px */
@media (max-width: 1000px) {
  .mobile-toc-btn {
    right: 32px; /* 完美对齐右侧边框 */
  }
}

/* 当屏幕 <= 680px 时，shell 左右各留白了 20px */
@media (max-width: 680px) {
  .mobile-toc-btn {
    right: 20px; /* 完美对齐右侧边框 */
  }
}

/* 其余部分：遮罩层和抽屉 */
@media (max-width: 1024px) {
  .toc-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.1);
    z-index: 999;
    backdrop-filter: blur(2px);
  }

  .mobile-toc-drawer {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 260px;
    background-color: var(--vp-c-bg);
    z-index: 1000;
    padding: 24px;
    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow-y: auto;
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
    color: var(--vp-c-text-2);
    cursor: pointer;
    padding: 4px;

    .toc-item {
      margin-bottom: 0;
    }
    .toc-item a {
      padding: 12px 0;
      font-size: 15px;
      border-bottom: 1px solid var(--vp-c-divider);
    }
  }
}
</style>
