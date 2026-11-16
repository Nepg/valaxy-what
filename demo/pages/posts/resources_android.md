---
title: 安卓资源整理
date: 2026-11-14
updated: 2026-11-16
hideHeader: true
---

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')

const categories = [
  {
    title: "未分类",
    apps: [
      { icon: "/icons/KeePassDX.png", name: "KeePassDX", desc: "密码管理", website: "https://github.com/Kunzisoft/KeePassDX", pan: "https://wwanv.lanzoum.com/ie9ii3xulztc" },
      { icon: "/icons/LocalSend.png", name: "LocalSend", desc: "局域网传文件", website: "https://localsend.org/zh-TW/download", pan: "https://wwanv.lanzoum.com/iUhK748qvsyh" },
      { icon: "/icons/gallery.png", name: "Gallery", desc: "图库", website: "https://github.com/FossifyOrg/Gallery", pan: "https://wwanv.lanzoum.com/iI30N3yfr6fg" },
      { icon: "/icons/nextplayer.png", name: "Next Player", desc: "视频播放", website: "https://github.com/anilbeesetti/nextplayer", pan: "https://wwanv.lanzoum.com/iHr8C3yfrdib" },
      { icon: "/icons/foldersync.png", name: "FolderSync", desc: "文件同步", website: "https://foldersync.io/", pan: "https://share.feijipan.com/s/YgyttS1i" },
      { icon: "/icons/mt.png", name: "MT管理器", desc: "", website: "https://mt2.cn/", pan: "https://share.feijipan.com/s/5wyttyZO" },
      { icon: "/icons/twinfile.png", name: "Twinfile", desc: "双栏文件管理器", website: "https://github.com/copylee711/twinfile", pan: "https://share.feijipan.com/s/jcytu01u" },
      { icon: "/icons/snapseed.png", name: "Snapseed", desc: "图片编辑", website: "https://play.google.com/store/apps/details?id=com.niksoftware.snapseed", pan: "https://share.feijipan.com/s/DLytuoLO" },
      { icon: "/icons/lotus.png", name: "Lotus", desc: "音乐播放器", website: "https://github.com/Bjorn99/lotus", pan: "https://share.feijipan.com/s/zDytuKuz" },
      { icon: "/icons/plees_tracker.png", name: "Plees Tracker", desc: "", website: "https://github.com/vmiklos/plees-tracker", pan: "https://share.feijipan.com/s/n2ytLI6H" },
      { icon: "/icons/markleaf.png", name: "Markleaf", desc: "", website: "https://github.com/jeiel85/markleaf-android", pan: "https://share.feijipan.com/s/0LytL7uN" },
      { icon: "/icons/gogogo.png", name: "影梭", desc: "模拟定位", website: "https://github.com/ZCShou/GoGoGo", pan: "https://share.feijipan.com/s/6Wyttcwz" },
      { icon: "/icons/appiconextractor.png", name: "图标提取器", desc: "", website: "https://github.com/0liuuil0/AppIconExtractor", pan: "https://share.feijipan.com/s/PxytLjSS" },
      { icon: "/icons/via.png", name: "Via", desc: "浏览器", website: "https://viayoo.com/zh-cn/", pan: "https://share.feijipan.com/s/lzyuDAzd" }
    ]
  }
]

// 核心：利用 computed 实时过滤数据
const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories
  
  const query = searchQuery.value.toLowerCase()
  
  return categories.map(category => {
    return {
      ...category,
      apps: category.apps.filter(app => 
        app.name.toLowerCase().includes(query) || 
        (app.desc && app.desc.toLowerCase().includes(query))
      )
    }
  }).filter(category => category.apps.length > 0) // 如果该分类下没有匹配的App，直接隐藏该分类
})
</script>

<!-- 搜索框 UI -->
<div class="ak-search-wrapper">
  <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square">
    <circle cx="10" cy="10" r="7"></circle>
    <line x1="15" y1="15" x2="21" y2="21"></line>
  </svg>
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
      <ResourceCard v-for="app in category.apps" :key="app.name" v-bind="app" />
    </div>
  </div>
  
  <!-- 无结果时的空状态 -->
  <div v-if="filteredCategories.length === 0" class="ak-empty-state">
    <div class="empty-code">ERR_404 / NO_DATA</div>
    <p>未检索到匹配项。</p>
  </div>
</div>

<style>
/* --- 搜索框终端风格样式 --- */
.ak-search-wrapper {
  position: relative;
  margin-top: 30px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  background-color: var(--ark-surface);
  border: 1px solid var(--ark-line);
  border-radius: 4px; /* 方正的圆角 */
  padding: 0 16px;
  height: 48px;
  transition: all 0.3s ease;
}

/* 焦点态：亮起蓝色边框和光晕 */
.ak-search-wrapper:focus-within {
  border-color: var(--ark-accent);
  box-shadow: 0 0 0 1px var(--ark-accent);
}

/* 搜索图标 */
.search-icon {
  color: var(--ark-muted);
  margin-right: 12px;
  transition: color 0.3s ease;
}
.ak-search-wrapper:focus-within .search-icon {
  color: var(--ark-accent);
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
  border-top: none;
  padding-top: 0;
  margin-top: 40px;
  margin-bottom: 12px ;
  font-family: var(--ark-font) !important;
  font-weight: 700 ; 
  font-size: 22px ;
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