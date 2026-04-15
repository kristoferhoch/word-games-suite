<template>
  <q-page class="game-page">
    <WordleStarterPanel />
  </q-page>
</template>

<script setup lang="ts">
import WordleStarterPanel from '../components/WordleStarterPanel.vue';
</script>

<style scoped lang="scss">
.game-page {
  width: min(1180px, 100%);
  margin: 0 auto;
  padding: 32px 20px 56px;
}
</style>
