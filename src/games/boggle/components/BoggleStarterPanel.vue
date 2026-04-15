<template>
  <section class="starter-panel">
    <p class="starter-kicker">
      Fast-Paced & Arcade
    </p>
    <h1 class="starter-title">
      Boggle-style word search
    </h1>
    <p class="starter-copy">
      Starter page for rapid-fire grid scanning, round timers, adjacency checks, and leaderboard-friendly scoring.
    </p>
    <div class="starter-pills">
      <span>Letter grid</span>
      <span>Round timer</span>
      <span>Word validation</span>
    </div>
  </section>
</template>

<style scoped lang="scss">
.starter-panel {
  padding: 28px;
  border: 2px solid rgba(44, 44, 84, 0.12);
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(255, 159, 28, 0.16), rgba(255, 255, 255, 0.95));
}

.starter-kicker,
.starter-title,
.starter-copy {
  margin: 0;
}

.starter-kicker {
  color: #d67200;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.starter-title {
  margin-top: 12px;
  color: var(--wgs-text-primary);
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 900;
}

.starter-copy {
  margin-top: 14px;
  max-width: 42rem;
  color: var(--wgs-text-secondary);
  line-height: 1.7;
}

.starter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.starter-pills span {
  padding: 9px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  color: var(--wgs-dark-outline);
  font-weight: 700;
}
</style>
