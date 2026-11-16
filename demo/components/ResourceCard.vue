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

/* 核心改动 1：干掉那坨大白底，换成极淡的透明光晕 */
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
  opacity: 0.4; /* 透明度调低，不要那么刺眼 */
}
html.dark .resource-card:hover::after { 
  opacity: 0.15; /* 色模式下只有极其微弱的背景辉光 */
}

/* 核心改动 2：对焦框大升级，左下角和右上角呼应 */
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
  transition: opacity 0.3s ease;
}
.card-main img {
  width: 44px;
  height: 44px;
  margin-right: 16px;
  object-fit: contain;
  transition: all 0.3s ease;
}
/* 核心改动 3：操作面板的动画 */
.card-actions {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: stretch;
  justify-content: center;
  background-color: transparent;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
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
  font-size: 14px;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  position: relative;
  
  /* 文字默认往下偏移一点点，悬浮时上浮 */
  transform: translateY(5px);
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
  transition: all 0.3s ease;
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
/* =========================================
   移动端：保留当前结构，注入 Ark 灵魂
   ========================================= */
@media (max-width: 768px) {
  .desktop-view {
    display: none;
  }
  .resource-card a {
    text-decoration: none;
  }
  /* 1. 物理切断 Hover 干扰 */
  .resource-card:hover {
    transform: none;
  }
  .resource-card:hover::before, 
  .resource-card:hover::after {
    opacity: 0;
  }
  .resource-card:hover .card-main {
    opacity: 1; /* 强制保持主内容可见 */
    pointer-events: auto;
  }
  .resource-card:hover .card-actions {
    display: none; /* 彻底关闭悬浮面板在移动端的触发 */
  }

  .resource-card {
    height: 76px; /* 稍微加高一点 */
    background-color: transparent;
    border: none;
    border-bottom: 1px solid var(--ark-line); /* 保持底部分割线 */
    border-radius: 0;
    animation: none; /* 移动端不需要入场动画 */
  }

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
    padding-left: 8px; 
  }

  .mobile-main-content {
    display: flex;
    align-items: center;
    overflow: hidden;
    gap: 12px;
  }

  .mobile-main-content img {
    width: 36px;
    height: 36px;
    object-fit: contain;
    flex-shrink: 0;
  }
  
  /* 2. Ark 字体 */
  .card-title {
    font-family: var(--ark-display) ; /* 标题用粗衬线体 */
    font-size: 16px !important;
    font-weight: 700 !important;
    letter-spacing: 0.5px;
    margin-bottom: 2px;
  }
  html.dark .card-title {
    text-shadow: 0 0 1px var(--ak-text-primary);
  }

  .card-desc {
    font-family: var(--ak-font-mono); /* 描述用等宽字体，极客感 */
    font-size: 11px !important;
    letter-spacing: 0px;
    color: var(--ark-muted);
    opacity: 0.8;
  }

  .mobile-hints {
    display: flex;
    align-items: stretch;
    flex-shrink: 0;
    height: 100%;
  }

  .hint-text {
    font-family: var(--ark-font) !important; /* 提示文字用无衬线 */
    color: var(--ark-muted) !important;
    font-size: 13px;
    font-weight: 500;
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 16px;
  }

  /* 独立网盘按钮 */
  .mobile-pan-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    color: var(--ark-accent) !important;
    font-family: var(--ark-font) !important;
    font-weight: 600;
    font-size: 13px;
    height: 100% !important;
    padding: 0 16px;
    text-decoration: none !important;
    flex-shrink: 0;
    position: relative;
  }
  
  /* 竖线分割保留，但高度缩短，更有呼吸感 */
  .mobile-pan-btn::before {
    content: '';
    position: absolute;
    left: 0;
    top: 35%;
    bottom: 35%;
    width: 1px;
    background-color: var(--ark-line);
  }
}

@media (prefers-reduced-motion: reduce) {
  .resource-card { animation: none; }
}
</style>