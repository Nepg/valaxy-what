<script setup lang="ts">
import { ref, computed } from 'vue'

interface ResourceApp {
  icon: string
  name: string
  desc?: string
  website?: string
  pan?: string
  keywords?: string[]
}

interface ResourceCategory {
  title: string
  apps: ResourceApp[]
}

const props = withDefaults(defineProps<{
  categories: ResourceCategory[]
  placeholder?: string
}>(), {
  // 默认就是你的终端风格，各页面可覆盖文案部分
  placeholder: '[SEARCH_INPUT] / 查找软件、功能...'
})

const searchQuery = ref('')

const filteredCategories = computed(() => {
  if (!searchQuery.value) return props.categories
  const query = searchQuery.value.toLowerCase()
  return props.categories
    .map(category => ({
      ...category,
      apps: category.apps.filter(app =>
        app.name.toLowerCase().includes(query) ||
        (app.desc && app.desc.toLowerCase().includes(query)) ||
        (app.keywords && app.keywords.some(k => k.toLowerCase().includes(query)))
      )
    }))
    .filter(category => category.apps.length > 0)
})
</script>

<template>
<div class="ak-search-wrapper">
  <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path></svg>
  <input 
    v-model="searchQuery" 
    type="text" 
    class="ak-search-input" 
    placeholder="[SEARCH_INPUT] / 查找软件、功能..." 
  />
  <div v-if="searchQuery" class="search-clear" @click="searchQuery = ''">✕</div>
</div>

  <div class="category-list">
    <div v-for="(category, index) in filteredCategories" :key="index" class="category-block">
      <h2 :id="category.title">{{ category.title }}</h2>
      <div class="resource-grid">
        <resource-card v-for="app in category.apps" :key="app.name" v-bind="app" />
      </div>
    </div>

    <div v-if="filteredCategories.length === 0" class="ak-empty-state">
      <div class="empty-code">ERR_404 / NO_DATA</div>
      <p>未检索到匹配项。</p>
    </div>
  </div>
</template>

<style>
/* --- 搜索框终端风格样式 --- */
.ak-search-wrapper {
  position: relative;
  margin-top: 30px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  border: none;
  border-radius: 0;
  
  /* 默认的底色 */
  background-color: var(--ark-surface); 
  padding: 0 16px;
  height: 48px;
  
  /* 这里的 transition 加上 box-shadow，让线条亮起更顺滑 */
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
}

/* 聚焦时的处理 */
.ak-search-wrapper:focus-within {
  /* 背景颜色不变，维持面板的实体感，微微提升一点点亮度（可选） */
  /* background-color: var(--ark-surface); */ 
  
  /* 底部亮起 1px 的蓝色扫描线 */
  box-shadow: 0 1px 0 0 var(--ark-accent); 
}
.search-icon {
  color: var(--ark-muted);
  margin-right: 18px; 
  opacity: 0.8;
  transition: color 0.3s ease, transform 0.3s ease;
}

/* 聚焦时，放大镜变蓝并轻微放大 */
.ak-search-wrapper:focus-within .search-icon {
  color: var(--ark-accent);
  opacity: 1;
  transform: scale(1.1); /* 微微放大一点点，像被激活了 */
}

/* 输入框本体：干掉所有浏览器默认样式 */
.ak-search-input {
  flex: 1;
  width: 100%; /* 确保占满 */
  background: transparent;
  
  /* 彻底干掉各种边框和轮廓 */
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  -webkit-appearance: none; /* 干掉 iOS/Safari 的默认圆角和阴影 */
  appearance: none;
  
  color: var(--ark-ink);
  font-family: var(--ak-font-mono);
  font-size: 14px;
  letter-spacing: 1px;
}

/* 针对聚焦状态二次确保 outline 被干掉 */
.ak-search-input:focus,
.ak-search-input:focus-visible {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

/* 输入框默认的占位文字样式 */
.ak-search-input::placeholder {
  color: var(--ark-muted);
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

/* 当输入框被点击/激活时，让提示文字瞬间消失 */
.ak-search-input:focus::placeholder {
  opacity: 0; 
}

/* 清除按钮 */
.search-clear {
  color: var(--ark-muted);
  cursor: pointer;
  padding: 4px;
  font-size: 12px;
  transition: color 0.2s;
}
.search-clear:hover {
  color: var(--ark-accent);
}

/* --- 空状态样式 --- */
.ak-empty-state {
  text-align: center;
  padding: 60px 0;
  color: var(--ark-muted);
}
.empty-code {
  font-family: var(--ak-font-mono);
  color: var(--ark-accent);
  font-size: 18px;
  letter-spacing: 2px;
  margin-bottom: 12px;
}

/* --- 分类与卡片网格（保留你之前的） --- */
.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

h2 {
  border-top: none !important;
  padding-top: 0 !important;
  margin-top: 40px !important;
  margin-bottom: 12px !important;
}

.category-block:first-child h2 {
  margin-top: 0 !important;
}

.category-block h2 {
  /* 清除原本的主题默认边框和间距 */
  border-top: none !important;
  border-bottom: none !important;
  padding-top: 0 !important;
  margin-top: 40px !important;
  margin-bottom: 20px !important; /* 稍微加大底距 */
  
  font-family: var(--ark-font) !important;
  font-weight: 700;
  font-size: 22px;
  color: var(--ark-ink);

  /* 变成 Flex 容器 */
  display: flex;
  align-items: center;
}

/* 利用伪元素生成右侧的延伸线 */
.category-block h2::after {
  content: '';
  flex: 1; /* 自动填满剩下的所有宽度 */
  height: 1px;
  background-color: var(--ark-line);
  margin-left: 16px; /* 和文字拉开距离 */
  
  /* 如果你喜欢虚线，可以换成 border-top: 1px dashed var(--ark-line); */
}

@media (max-width: 768px) {
  h2 {
    margin-top: 30px !important;
    margin-bottom: 10px !important;
  }
  .category-block:first-child h2 {
    margin-top: 0 !important;
  }
}
</style>