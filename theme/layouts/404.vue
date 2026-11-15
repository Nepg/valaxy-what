<script setup lang="ts">
import { useArknightsText } from '../composables/config'

const text = useArknightsText()
</script>

<template>
  <Layout>
    <main id="ark-main" class="ark-not-found" tabindex="-1">
      <p class="ark-eyebrow">
        404 / NOT FOUND
      </p><h1>{{ text.notFound }}</h1><RouterLink to="/" class="ak-button ark-action">
        {{ text.returnHome }}
      </RouterLink>
    </main>
  </Layout>
</template>
