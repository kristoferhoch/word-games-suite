<template>
  <q-page class="game-page">
    <BoggleStarterPanel />
  </q-page>
</template>

<script setup lang="ts">
import BoggleStarterPanel from '../components/BoggleStarterPanel.vue';
</script>

<style scoped lang="scss">
.game-page {
  width: min(1180px, 100%);
  margin: 0 auto;
  padding: 32px 20px 56px;
}
</style>
