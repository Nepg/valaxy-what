<script setup lang="ts">
import { useSiteConfig } from 'valaxy'
import { useArknightsText, useArknightsTheme } from '../composables/config'

const site = useSiteConfig()
const theme = useArknightsTheme()
const text = useArknightsText()
</script>

<template>
  <div class="ark-shell" :style="{ '--ark-accent': theme.accent }">
    <a class="ark-skip" href="#ark-main">{{ text.skip }}</a>
    <ArknightsNav />
    <slot><RouterView /></slot>
    <!-- <footer class="ark-footer">
      <div><span class="ark-mark" aria-hidden="true">▰</span> {{ site.title }}</div>
      <p v-if="theme.footer">
        {{ theme.footer }}
      </p>
      <p><a href="https://valaxy.site">Valaxy</a> × <a href="https://github.com/valaxyjs/valaxy-theme-arknights">Arknights</a> · <a href="https://ak-ui.yyj.moe">AK UI</a> · <a :href="`https://valaxy.site/${site.lang.startsWith('zh') ? 'zh/' : ''}themes/arknights`">{{ text.docs }}</a></p>
    </footer> -->
  </div>
</template>
