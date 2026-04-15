<template>
  <q-page class="game-page">
    <WordConnectStarterPanel />
  </q-page>
</template>

<script setup lang="ts">
import WordConnectStarterPanel from '../components/WordConnectStarterPanel.vue';
</script>

<style scoped lang="scss">
.game-page {
  width: min(1180px, 100%);
  margin: 0 auto;
  padding: 32px 20px 56px;
}
</style>
