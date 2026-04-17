<template>
  <q-layout view="lHh Lpr lFf" class="main-layout">
    <q-header class="app-header">
      <q-toolbar class="app-toolbar">
        <q-toolbar-title class="brand-title">
          <img
            class="brand-logo"
            src="~assets/word-games-suite-logo.png"
            alt=""
            aria-hidden="true"
          >
          <span>Word Games Suite</span>
        </q-toolbar-title>

        <q-btn-dropdown
          flat
          no-caps
          class="games-menu"
          label="Games"
          dropdown-icon="expand_more"
        >
          <q-list class="games-list">
            <q-item
              v-for="game in games"
              :key="game.path"
              v-close-popup
              clickable
              @click="openGame(game.path)"
            >
              <q-item-section>
                <q-item-label>{{ game.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const games = [
  { label: 'Boggle', path: '/boggle' },
  { label: 'Crossword', path: '/crossword' },
  { label: 'Scrabble', path: '/scrabble' },
  { label: 'Typing Race', path: '/typing-race' },
  { label: 'Word Connect', path: '/word-connect' },
  { label: 'Wordle', path: '/wordle' },
];

function openGame(path: string) {
  void router.push(path);
}
</script>

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
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--wgs-dark-outline);
}

.brand-logo {
  flex: 0 0 auto;
  width: 42px;
  height: 42px;
  object-fit: contain;
  filter: drop-shadow(0 8px 12px rgba(31, 111, 219, 0.18));
}

.games-menu {
  margin-right: 12px;
  color: var(--wgs-deep-blue);
  font-size: 0.9rem;
  font-weight: 800;
}

.games-list {
  min-width: 180px;
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
