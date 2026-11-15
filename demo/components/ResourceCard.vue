<script setup>
import { withBase } from 'valaxy'

defineProps({
  icon: { type: String, required: true },
  name: { type: String, required: true },
  desc: { type: String, default: '' },
  website: { type: String, default: '' },
  pan: { type: String, default: '' },
})
</script>

<template>
  <div class="resource-card">
    <!-- 1. 桌面端视图 -->
    <div class="desktop-view">
      <div class="card-main">
        <img :src="withBase(icon)" :alt="name">
        <div class="card-text">
          <div
            class="card-title"
            :class="{
              'title-short': name.length <= 8,
              'title-medium': name.length > 8 && name.length <= 12,
              'title-long': name.length > 12,
            }"
          >
            {{ name }}
          </div>
          <div v-if="desc" class="card-desc">
            {{ desc }}
          </div>
        </div>
      </div>

      <div class="card-actions">
        <a v-if="website" :href="website" target="_blank" class="action-btn">
          <span>官网</span>
          <span class="btn-index">01</span> <!-- 加入序号 -->
        </a>
        <a v-if="pan" :href="pan" target="_blank" class="action-btn">
          <span>网盘</span>
          <span class="btn-index">02</span> <!-- 加入序号 -->
        </a>
      </div>
    </div>

    <!-- 2. 移动端视图  -->
    <div class="mobile-view">
      <!-- 左侧大热区 -->
      <a :href="website || pan" target="_blank" class="mobile-main">
        <div class="mobile-main-content">
          <img class="app-logo" :src="withBase(icon)" :alt="name">
          <div class="card-text">
            <div
              class="card-title"
              :title="name"
              :class="{
                'title-short': name.length <= 8,
                'title-medium': name.length > 8 && name.length <= 12,
                'title-long': name.length > 12,
              }"
            >
              {{ name }}
            </div>
            <div v-if="desc" class="card-desc">{{ desc }}</div>
          </div>
        </div>

        <!-- 恢复为原本的纯文本提示，不嵌套 a 标签 -->
        <div class="mobile-hints">
          <span v-if="website" class="hint-text">官网</span>
          <span v-if="!website && pan" class="hint-text">网盘</span>
        </div>
      </a>

      <!-- 独立网盘按钮 -->
      <a
        v-if="website && pan"
        :href="pan"
        target="_blank"
        class="mobile-pan-btn"
      >
        网盘
      </a>
    </div>
  </div>
</template>

<style scoped>
/* 定义入场动画 */
@keyframes akEnter {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 文本排版降噪 */
.card-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}
.card-title {
  font-family: var(--ark-display); 
  font-weight: 700;
  color: var(--ark-ink);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 17px; 
  letter-spacing: 0.5px;
}
html.dark .card-title {
  color: var(--ak-text-primary);
  text-shadow: 0 0 1px var(--ak-text-primary); 
}
.card-desc {
  font-family: var(--ark-font); 
  font-size: 12px;
  font-weight: 400;
  color: var(--ark-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.5px;
}

/* =========================================
   桌面端卡片样式
   ========================================= */
/* =========================================
   卡片本体
   ========================================= */
.resource-card {
  animation: akEnter 0.3s cubic-bezier(0.4, 0, 0.2, 1) both;
  position: relative;
  height: 90px;
  border: none;
  background-color: transparent; 
  transition: transform 0.2s ease;
  overflow: hidden;
}

/* 👇 核心改动 1：干掉那坨大白底，换成极淡的透明光晕 */
.resource-card:hover {
  transform: translateY(-2px); /* 悬浮时整个卡片微微上浮 */
}

.resource-card::after {
  content: '';
  position: absolute;
  inset: 0;
  /* 用半透明背景色代替纯色，浅色下是极淡的灰，深色下是极淡的光 */
  background-color: var(--ark-surface); 
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 0;
  /* 圆角稍微收一点，感觉更硬朗 */
  border-radius: 4px;
}

.resource-card:hover::after { 
  opacity: 0.4; /* 👈 透明度调低，不要那么刺眼 */
}
html.dark .resource-card:hover::after { 
  opacity: 0.15; /* 👈 深色模式下只有极其微弱的背景辉光 */
}

/* 👇 核心改动 2：对焦框大升级，左下角和右上角呼应 */
.resource-card::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 8px;
  width: 10px;
  height: 10px;
  border-top: 1px solid var(--ark-accent);
  border-left: 1px solid var(--ark-accent);
  opacity: 0;
  transform: translate(-2px, -2px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
  pointer-events: none;
}
/* 用伪元素再画一个右下角的角标 */
.card-main::after {
  content: '';
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 10px;
  height: 10px;
  border-bottom: 1px solid var(--ark-accent);
  border-right: 1px solid var(--ark-accent);
  opacity: 0;
  transform: translate(2px, 2px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
  pointer-events: none;
}

.resource-card:hover::before,
.resource-card:hover .card-main::after {
  opacity: 0.7; /* 不要全亮，留点克制 */
  transform: translate(0, 0);
}

.desktop-view {
  position: absolute;
  inset: 0;
  z-index: 1;
}

/* 隐藏内容层 */
.card-main {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  padding: 0 20px;
  transition: opacity 0.2s ease;
}
.card-main img {
  width: 44px;
  height: 44px;
  margin-right: 16px;
  object-fit: contain;
  transition: all 0.3s ease;
}
html.dark .card-main img {
  filter: saturate(0.95) opacity(0.95);
}

/* 👇 核心改动 3：操作面板的动画更有仪式感 */
.card-actions {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: stretch;
  justify-content: center;
  background-color: transparent;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
  z-index: 2;
}

.resource-card:hover .card-main {
  opacity: 0;
  pointer-events: none;
}
.resource-card:hover .card-actions {
  opacity: 1;
  pointer-events: auto;
}

/* 操作按钮 */
.action-btn {
  font-family: var(--ark-font); 
  flex: 1;
  display: flex;
  flex-direction: row; 
  align-items: center;
  justify-content: center; 
  gap: 8px;
  height: 100%;
  text-decoration: none !important;
  color: var(--ark-muted) !important;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 1px;
  transition: all 0.2s ease;
  position: relative;
  
  /* 文字默认往下偏移一点点，悬浮时上浮 */
  transform: translateY(4px);
}
.resource-card:hover .action-btn {
  transform: translateY(0);
}

.action-btn + .action-btn::before {
  content: '';
  position: absolute;
  left: 0;
  top: 30%;
  bottom: 30%;
  width: 1px;
  background-color: var(--ark-line);
}

.action-btn:hover {
  background-color: transparent; 
  color: var(--ark-accent) !important; 
}

.action-btn .btn-index {
  font-family: var(--ak-font-mono); 
  font-size: 10px;
  color: var(--ak-text-secondary);
  opacity: 0.5;
  margin-left: 4px;
  transition: all 0.2s ease;
}

.action-btn:hover .btn-index {
  color: var(--ark-accent);
  opacity: 1;
}

/* =========================================
   移动端视图
   ========================================= */
.mobile-view {
  display: none;
}

@media (max-width: 768px) {
  .desktop-view { display: none; }
  .app-logo { margin-left: 0; }

  .resource-card {
    animation: none; /* 移动端不需要入场动画，滑动即可 */
    height: 68px;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid var(--ark-line);
    border-radius: 0;
  }
  
  .resource-card::before,
  .resource-card::after { display: none; }

  .mobile-view {
    display: flex;
    align-items: stretch;
    width: 100%;
    height: 100%;
    padding: 0;
  }

  .mobile-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    height: 100%;
    overflow: hidden;
    text-decoration: none !important;
    color: inherit !important;
    padding-left: 4px;
  }

  .mobile-main-content {
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .mobile-main-content img {
    width: 36px;
    height: 36px;
    margin-right: 12px;
    object-fit: contain;
    flex-shrink: 0;
  }
  
  /* 👇 修复了 0. 的笔误，改为 0.75 */
  html.dark .mobile-main-content img {
    filter: saturate(0.75); 
  }
  
  .title-short { font-size: 15px !important; }
  .title-medium { font-size: 14px !important; }
  .title-long { font-size: 13px !important; }

  .card-title {
    font-size: 15px;
    letter-spacing: 0;
  }
  .card-desc {
    font-size: 12px;
    color: var(--ark-muted);
  }

  .mobile-hints {
    display: flex;
    align-items: stretch;
    flex-shrink: 0;
    height: 100%;
  }

  .hint-text {
    color: var(--ark-muted) !important;
    font-size: 12px;
    font-weight: 500;
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 16px;
    box-sizing: border-box;
    letter-spacing: 1px;
  }

  .mobile-pan-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    color: var(--ark-accent) !important;
    font-weight: 600;
    font-size: 12px;
    letter-spacing: 1px;
    height: 100% !important;
    padding: 0 16px;
    text-decoration: none !important;
    flex-shrink: 0;
    position: relative;
  }
  
  .mobile-pan-btn::before {
    content: '';
    position: absolute;
    left: 0;
    top: 30%;
    bottom: 30%;
    width: 1px;
    background-color: var(--ark-line);
  }
}

@media (prefers-reduced-motion: reduce) {
  .resource-card { animation: none; }
}
</style>