<!-- demo/components/WindowsResources.vue -->
<script setup lang="ts">
import categories from '../data/resources-windows.json'
import ResourcePage from './resource-page.vue'
</script>

<template>
  <ResourcePage :categories="categories"/>
</template>