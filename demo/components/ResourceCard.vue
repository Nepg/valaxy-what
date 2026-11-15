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
          <span class="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="currentColor"
            >
              <path
                d="M13.0607 8.11097L14.4749 9.52518C17.2086 12.2589 17.2086 16.691 14.4749 19.4247L14.1214 19.7782C11.3877 22.5119 6.95555 22.5119 4.22188 19.7782C1.48821 17.0446 1.48821 12.6124 4.22188 9.87874L5.6361 11.293C3.68348 13.2456 3.68348 16.4114 5.6361 18.364C7.58872 20.3166 10.7545 20.3166 12.7072 18.364L13.0607 18.0105C15.0133 16.0578 15.0133 12.892 13.0607 10.9394L11.6465 9.52518L13.0607 8.11097ZM19.7782 14.1214L18.364 12.7072C20.3166 10.7545 20.3166 7.58872 18.364 5.6361C16.4114 3.68348 13.2456 3.68348 11.293 5.6361L10.9394 5.98965C8.98678 7.94227 8.98678 11.1081 10.9394 13.0607L12.3536 14.4749L10.9394 15.8891L9.52518 14.4749C6.79151 11.7413 6.79151 7.30911 9.52518 4.57544L9.87874 4.22188C12.6124 1.48821 17.0446 1.48821 19.7782 4.22188C22.5119 6.95555 22.5119 11.3877 19.7782 14.1214Z"
              />
            </svg>
          </span>
          官网
        </a>
        <a v-if="pan" :href="pan" target="_blank" class="action-btn">
          <span class="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path
                d="M13 13V18.585L14.8284 16.7574L16.2426 18.1716L12 22.4142L7.75736 18.1716L9.17157 16.7574L11 18.585V13H13ZM12 2C15.5934 2 18.5544 4.70761 18.9541 8.19395C21.2858 8.83154 23 10.9656 23 13.5C23 16.3688 20.8036 18.7246 18.0006 18.9776L18.0009 16.9644C19.6966 16.7214 21 15.2629 21 13.5C21 11.567 19.433 10 17.5 10C17.2912 10 17.0867 10.0183 16.8887 10.054C16.9616 9.7142 17 9.36158 17 9C17 6.23858 14.7614 4 12 4C9.23858 4 7 6.23858 7 9C7 9.36158 7.03838 9.7142 7.11205 10.0533C6.91331 10.0183 6.70879 10 6.5 10C4.567 10 3 11.567 3 13.5C3 15.2003 4.21241 16.6174 5.81986 16.934L6.00005 16.9646L6.00039 18.9776C3.19696 18.7252 1 16.3692 1 13.5C1 10.9656 2.71424 8.83154 5.04648 8.19411C5.44561 4.70761 8.40661 2 12 2Z"
              />
            </svg>
          </span>
          网盘
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
/* 桌面端文本排版降噪 */
.card-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}
.card-title {
  font-weight: 700;
  color: var(--ark-ink);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 16px;
  letter-spacing: 0.5px;
}
.card-desc {
  font-size: 12px;
  font-weight: 400;
  color: var(--ark-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.5px;
}

/* =========================================
   桌面端卡片样式（工业级克制版）
   ========================================= */
.resource-card {
  position: relative;
  height: 90px;
  border: none;
  background-color: transparent; /* 完全透明 */
  transition: all 0.2s linear;
  overflow: hidden;
}

/* 悬浮时的背景层（极淡） */
.resource-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background-color: var(--ark-surface);
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 0;
}
.resource-card:hover::after {
  opacity: 1;
}

/* 核心：左上角的对焦框线条 */
.resource-card::before {
  content: '';
  position: absolute;
  top: 12px;
  left: 12px;
  width: 8px;
  height: 8px;
  border-top: 1px solid var(--ark-accent);
  border-left: 1px solid var(--ark-accent);
  opacity: 0;
  transform: translate(-4px, -4px); /* 初始稍微偏离，动画滑入 */
  transition: all 0.2s ease;
  z-index: 2;
}
.resource-card:hover::before {
  opacity: 1;
  transform: translate(0, 0);
}

.desktop-view {
  position: absolute;
  inset: 0;
  z-index: 1; /* 保证内容在背景层之上 */
}

.card-main {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  padding: 0 20px;
  transition: opacity 0.2s ease;
}

/* 图标默认褪色，悬浮恢复彩色 */
.card-main img {
  width: 44px;
  height: 44px;
  margin-right: 16px;
  object-fit: contain;
  transition: all 0.3s ease;
}
.resource-card:hover .card-main img {
  transform: scale(1.05); /* 极微小的放大 */
}

/* 悬浮后的操作面板 */
.card-actions {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: stretch;
  justify-content: center;
  background-color: transparent;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.resource-card:hover .card-main {
  opacity: 0;
  pointer-events: none;
}
.resource-card:hover .card-actions {
  opacity: 1;
  pointer-events: auto;
}

/* 操作按钮：极简到只剩下文字和线 */
.action-btn {
  flex: 1;
  display: flex;
  flex-direction: row; /* 图标和文字并排 */
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
}

/* 按钮间的半截细线分割 */
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

.action-btn .icon {
  font-size: 18px;
  margin-bottom: 0; /* 取消之前向下的 margin */
}

/* 默认隐藏移动端视图 */
.mobile-view {
  display: none;
}

/* =========================================
   移动端：纯正的终端列表风
   ========================================= */
@media (max-width: 768px) {
  .desktop-view {
    display: none;
  }
  .app-logo {
    margin-left: 0;
  }

  .resource-card {
    height: 68px; /* 稍微加高一点点 */
    background-color: transparent;
    border: none;
    border-bottom: 1px solid var(--ark-line);
    border-radius: 0;
  }
  /* 干掉移动端的伪元素干扰 */
  .resource-card::before,
  .resource-card::after {
    display: none;
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
    text-decoration: none !important;
    color: inherit !important;
    padding-left: 4px; /* 左侧留一点点白 */
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
    filter: none; /* 移动端保持彩色 */
  }
  
  .title-short { font-size: 15px !important; }
  .title-medium { font-size: 14px !important; }
  .title-long { font-size: 13px !important; }

  .card-title {
    margin-bottom: 2px;
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

  /* 移动端独立网盘按钮：纯文字，无任何底色 */
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
  
  /* 移动端网盘按钮的极细竖线 */
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
</style>