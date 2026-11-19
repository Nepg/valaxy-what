<script setup lang="ts">
import type { MenuController } from '@yunyoujun/ak-ui/site'
import type { NavItem } from '../types'
import { createMobileMenu } from '@yunyoujun/ak-ui/site'
import { onMounted, onScopeDispose, shallowRef, useId, useTemplateRef } from 'vue'
import { useRoute } from 'vue-router'
import { useArknightsText } from '../composables/config'

defineProps<{ items: NavItem[] }>()
const text = useArknightsText()
const route = useRoute()
const id = useId()
const ready = shallowRef(false)
const trigger = useTemplateRef<HTMLButtonElement>('trigger')
const dialog = useTemplateRef<HTMLDialogElement>('dialog')
let controller: MenuController | undefined

onMounted(() => {
  if (!trigger.value || !dialog.value || typeof dialog.value.showModal !== 'function')
    return
  controller = createMobileMenu(dialog.value, { trigger: trigger.value })
  ready.value = true
})
onScopeDispose(() => controller?.destroy())
</script>

<template>
  <div></div>
  <!-- <div class="ark-mobile-nav">
    <button ref="trigger" class="ark-menu-trigger ak-site-control" type="button" :hidden="!ready" :aria-controls="id" aria-haspopup="dialog" aria-expanded="false">
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 7h16M4 12h12M4 17h16" fill="none" stroke="currentColor" stroke-width="1.5" /></svg>
      <span class="ark-sr-only">{{ text.menu }}</span>
    </button>
    <dialog :id="id" ref="dialog" class="ak-site-menu ark-menu" :aria-label="text.navigation">
      <div class="ark-menu-heading">
        <span class="ark-eyebrow">{{ text.navigation }}</span>
        <button class="ak-site-control ark-menu-close" type="button" data-ak-menu-close autofocus :aria-label="text.closeMenu">
          ×
        </button>
      </div>
      <nav :aria-label="text.navigation" class="ark-menu-links">
        <template v-for="item in items" :key="item.link">
          <a v-if="/^(?:https?:|mailto:)/.test(item.link)" :href="item.link" data-ak-menu-item>{{ item.text }} <span aria-hidden="true">↗</span></a>
          <RouterLink v-else :to="item.link" data-ak-menu-item>
            {{ item.text }} <span aria-hidden="true">{{ route.path === item.link ? '—' : '↗' }}</span>
          </RouterLink>
        </template>
      </nav>
    </dialog>
  </div> -->
</template>
