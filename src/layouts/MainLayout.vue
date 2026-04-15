<template>
  <q-layout view="lHh Lpr lFf" class="main-layout">
    <q-header class="app-header">
      <q-toolbar class="app-toolbar">
        <q-toolbar-title class="brand-title">
          Word Games Suite
        </q-toolbar-title>

        <div class="version-pill">
          Quasar v{{ $q.version }}
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped lang="scss">
.main-layout {
  color: var(--wgs-text-primary);
}

.app-header {
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(18px);
  border-bottom: 2px solid rgba(44, 44, 84, 0.12);
  box-shadow: 0 14px 32px rgba(31, 111, 219, 0.12);
}

.app-toolbar {
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 20px;
}

.brand-title {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--wgs-dark-outline);
}

.version-pill {
  padding: 8px 14px;
  border: 2px solid rgba(31, 111, 219, 0.18);
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(46, 168, 255, 0.14), rgba(255, 197, 58, 0.18));
  color: var(--wgs-deep-blue);
  font-size: 0.85rem;
  font-weight: 700;
}
</style>
