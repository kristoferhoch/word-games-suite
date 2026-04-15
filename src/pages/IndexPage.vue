<template>
  <q-page class="landing-page">
    <div class="page-shell">
      <section class="hero-section">
        <div class="hero-copy">
          <div class="eyebrow">
            Modern wordplay for every kind of player
          </div>
          <h1 class="hero-title">
            Play Smarter. Think Faster. Master Words.
          </h1>
          <p class="hero-subtitle">
            A modern suite of word games, strategy, speed, and creativity all in one place.
            Challenge yourself, compete with others, and sharpen your mind every day.
          </p>

          <div class="hero-actions">
            <q-btn
              unelevated
              no-caps
              class="cta-primary"
              label="Start Playing"
              href="#games"
            />
            <q-btn
              outline
              no-caps
              class="cta-secondary"
              label="Daily Challenge"
              to="/wordle"
            />
          </div>

          <div class="hero-stats">
            <div
              v-for="stat in heroStats"
              :key="stat.label"
              class="stat-chip"
            >
              <span class="stat-value">{{ stat.value }}</span>
              <span class="stat-label">{{ stat.label }}</span>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="logo-cloud">
            <img
              class="hero-logo"
              src="~assets/word-games-suite-logo.png"
              alt="Word Games Suite logo"
            >
          </div>

          <div class="floating-card floating-card-top">
            Strategy, speed, and streaks
          </div>

          <div class="floating-card floating-card-bottom">
            Daily challenges. Global competition.
          </div>
        </div>
      </section>

      <section class="section-block feature-banner">
        <p class="section-kicker">
          Feature Highlight
        </p>
        <h2 class="section-title">
          All Your Favorite Word Games. One Powerful Platform.
        </h2>
        <p class="section-copy">
          From classic board-style strategy to fast-paced puzzles and creative challenges,
          Word Games Suite brings together the best word experiences in a single, seamless app.
        </p>
      </section>

      <section id="games" class="section-block">
        <div class="section-heading">
          <div>
            <p class="section-kicker">
              Game Modes
            </p>
            <h2 class="section-title">
              Four ways to play, compete, and improve
            </h2>
          </div>
        </div>

        <div class="mode-grid">
          <article
            v-for="mode in gameModes"
            :key="mode.title"
            class="mode-card"
            :class="mode.accent"
          >
            <div class="mode-icon">
              {{ mode.icon }}
            </div>
            <h3 class="mode-title">
              {{ mode.title }}
            </h3>
            <ul class="mode-list">
              <li
                v-for="item in mode.points"
                :key="item"
              >
                {{ item }}
              </li>
            </ul>
            <p class="mode-note">
              {{ mode.note }}
            </p>
          </article>
        </div>
      </section>

      <section class="section-block">
        <div class="section-heading">
          <div>
            <p class="section-kicker">
              Why Word Games Suite?
            </p>
            <h2 class="section-title">
              Built to keep players learning, improving, and coming back
            </h2>
          </div>
        </div>

        <div class="benefit-grid">
          <article
            v-for="benefit in benefits"
            :key="benefit.title"
            class="benefit-card"
          >
            <div class="benefit-icon">
              {{ benefit.icon }}
            </div>
            <h3 class="benefit-title">
              {{ benefit.title }}
            </h3>
            <p class="benefit-copy">
              {{ benefit.copy }}
            </p>
          </article>
        </div>
      </section>

      <section class="section-block">
        <div class="section-heading">
          <div>
            <p class="section-kicker">
              Core Games Included
            </p>
            <h2 class="section-title">
              Launch into the suite
            </h2>
          </div>
          <p class="section-copy compact">
            More games added regularly.
          </p>
        </div>

        <div class="games-grid">
          <article
            v-for="game in games"
            :key="game.slug"
            class="game-card"
          >
            <div class="game-card-top">
              <div class="game-icon">
                {{ game.icon }}
              </div>
              <div class="game-meta">
                <h3 class="game-title">
                  {{ game.title }}
                </h3>
                <p class="game-tag">
                  {{ game.tag }}
                </p>
              </div>
            </div>

            <p class="game-description">
              {{ game.description }}
            </p>

            <q-btn
              flat
              no-caps
              class="game-link"
              :label="`Open ${game.shortLabel}`"
              :to="game.path"
            />
          </article>
        </div>
      </section>

      <section class="section-block spotlight-grid">
        <article class="spotlight-card trophy-card">
          <p class="section-kicker">
            Compete & Achieve
          </p>
          <h2 class="section-title small">
            Climb the leaderboards, earn achievements, and prove your word mastery.
          </h2>
          <ul class="spotlight-list">
            <li>Global rankings</li>
            <li>Daily & weekly competitions</li>
            <li>Skill-based matchmaking</li>
          </ul>
        </article>

        <article class="spotlight-card player-card">
          <p class="section-kicker">
            Built for Every Player
          </p>
          <h2 class="section-title small">
            Whether you're here for a quick challenge or chasing mastery, the suite adapts to your pace.
          </h2>
        </article>
      </section>

      <section class="section-block final-cta">
        <div class="final-cta-copy">
          <p class="section-kicker">
            Ready to Put Your Words to the Test?
          </p>
          <h2 class="section-title">
            Join thousands of players and start your journey today.
          </h2>
        </div>

        <div class="hero-actions">
          <q-btn
            unelevated
            no-caps
            class="cta-primary"
            label="Play Now"
            to="/scrabble"
          />
          <q-btn
            outline
            no-caps
            class="cta-secondary"
            label="Try Daily Challenge"
            to="/wordle"
          />
        </div>
      </section>

      <footer class="landing-footer">
        Word Games Suite - Where Words Become Play.
      </footer>
    </div>
  </q-page>
</template>

<script setup lang="ts">
const heroStats = [
  { value: '6', label: 'core games' },
  { value: '4', label: 'play styles' },
  { value: '24/7', label: 'brain training' },
];

const gameModes = [
  {
    icon: 'SC',
    title: 'Strategy & Classics',
    points: [
      'Scrabble-style competitive play',
      'Crossword puzzles with daily themes',
      'Word-building challenges for deep thinkers',
    ],
    note: 'Perfect for players who love planning, vocabulary, and high scores.',
    accent: 'mode-blue',
  },
  {
    icon: 'AR',
    title: 'Fast-Paced & Arcade',
    points: [
      'Boggle-style rapid word finding',
      'Typing races and timed challenges',
      'Swipe-to-connect word puzzles',
    ],
    note: 'Quick rounds. Instant fun. Test your speed and accuracy.',
    accent: 'mode-orange',
  },
  {
    icon: 'PL',
    title: 'Puzzle & Logic',
    points: [
      'Wordle-style daily challenges',
      'Cryptograms and decoding puzzles',
      'Word ladders and logic transformations',
    ],
    note: 'Think critically, solve patterns, and keep your streak alive.',
    accent: 'mode-pink',
  },
  {
    icon: 'MP',
    title: 'Social & Multiplayer',
    points: [
      'Real-time and turn-based matches',
      'Friendly competitions and global leaderboards',
      'Party-style word games for groups',
    ],
    note: 'Play solo or challenge friends, anytime, anywhere.',
    accent: 'mode-green',
  },
];

const benefits = [
  {
    icon: 'IQ',
    title: 'Train Your Brain',
    copy: 'Improve vocabulary, memory, and problem-solving skills while having fun.',
  },
  {
    icon: 'DA',
    title: 'Daily Challenges',
    copy: 'New puzzles every day to keep you engaged and coming back.',
  },
  {
    icon: 'SO',
    title: 'Play Your Way',
    copy: 'Solo, competitive, or cooperative, choose your style.',
  },
  {
    icon: 'XP',
    title: 'Track Your Progress',
    copy: 'Streaks, rankings, and performance stats help you level up.',
  },
];

const games = [
  {
    slug: 'scrabble',
    title: 'Scrabble-style board game',
    shortLabel: 'Scrabble',
    icon: 'SB',
    tag: 'Strategy & classics',
    description: 'Tile placement, premium squares, and score-chasing strategy for thoughtful competitors.',
    path: '/scrabble',
  },
  {
    slug: 'boggle',
    title: 'Boggle-style word search',
    shortLabel: 'Boggle',
    icon: 'BG',
    tag: 'Fast-paced arcade',
    description: 'Race the clock, scan the grid, and find as many words as you can before time runs out.',
    path: '/boggle',
  },
  {
    slug: 'wordle',
    title: 'Wordle-style daily puzzle',
    shortLabel: 'Wordle',
    icon: 'WD',
    tag: 'Puzzle & logic',
    description: 'A daily test of deduction with satisfying guesses, streaks, and shareable results.',
    path: '/wordle',
  },
  {
    slug: 'crossword',
    title: 'Crossword challenges',
    shortLabel: 'Crossword',
    icon: 'CW',
    tag: 'Vocabulary & themes',
    description: 'Classic clues, daily themes, and satisfying solves for players who love layered wordplay.',
    path: '/crossword',
  },
  {
    slug: 'word-connect',
    title: 'Word Connect',
    shortLabel: 'Word Connect',
    icon: 'WC',
    tag: 'Swipe puzzle',
    description: 'Connect letters, discover hidden words, and build momentum through quick, rewarding rounds.',
    path: '/word-connect',
  },
  {
    slug: 'typing-race',
    title: 'Typing Race',
    shortLabel: 'Typing Race',
    icon: 'TR',
    tag: 'Speed & accuracy',
    description: 'Type fast, stay precise, and outpace the field in competitive word-driven races.',
    path: '/typing-race',
  },
];
</script>

<style scoped lang="scss">
.landing-page {
  padding: 32px 20px 64px;
}

.page-shell {
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: min(1180px, 100%);
  margin: 0 auto;
}

.hero-section,
.section-block,
.spotlight-card {
  border: 2px solid rgba(44, 44, 84, 0.12);
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.86);
  box-shadow:
    0 22px 44px rgba(31, 111, 219, 0.12),
    0 10px 0 rgba(91, 62, 150, 0.12);
}

.hero-section {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
  gap: 28px;
  padding: 32px;
  overflow: hidden;
}

.hero-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
}

.eyebrow,
.section-kicker {
  margin: 0;
  width: fit-content;
  padding: 8px 14px;
  border-radius: 999px;
  background: var(--wgs-soft-yellow);
  color: var(--wgs-dark-outline);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-title {
  margin: 0;
  font-size: clamp(2.9rem, 7vw, 5.8rem);
  line-height: 0.92;
  font-weight: 900;
  color: var(--wgs-text-primary);
  text-wrap: balance;
}

.hero-subtitle,
.section-copy,
.benefit-copy,
.game-description,
.mode-note {
  margin: 0;
  color: var(--wgs-text-secondary);
  line-height: 1.7;
}

.hero-subtitle {
  max-width: 40rem;
  font-size: 1.08rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.cta-primary,
.cta-secondary {
  min-height: 52px;
  padding: 0 20px;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 800;
}

.cta-primary {
  background: linear-gradient(135deg, var(--wgs-blue), var(--wgs-deep-blue));
  color: var(--wgs-card-white);
  box-shadow: 0 12px 24px rgba(31, 111, 219, 0.24);
}

.cta-secondary {
  border: 2px solid rgba(44, 44, 84, 0.14);
  color: var(--wgs-dark-outline);
  background: rgba(255, 255, 255, 0.75);
}

.hero-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.stat-chip {
  display: grid;
  gap: 4px;
  min-width: 120px;
  padding: 14px 16px;
  border: 2px solid rgba(44, 44, 84, 0.1);
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(110, 208, 255, 0.12), rgba(255, 226, 122, 0.18));
}

.stat-value {
  color: var(--wgs-deep-blue);
  font-size: 1.3rem;
  font-weight: 900;
}

.stat-label {
  color: var(--wgs-text-secondary);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.hero-visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 440px;
  border-radius: 28px;
  background:
    radial-gradient(circle at top, rgba(255, 197, 58, 0.86), transparent 32%),
    radial-gradient(circle at 10% 100%, rgba(76, 217, 100, 0.42), transparent 28%),
    radial-gradient(circle at 100% 15%, rgba(255, 79, 163, 0.34), transparent 28%),
    linear-gradient(150deg, rgba(46, 168, 255, 0.14), rgba(255, 255, 255, 0.95));
}

.logo-cloud {
  display: flex;
  align-items: center;
  justify-content: center;
  width: min(100%, 420px);
  padding: 28px;
  border: 2px dashed rgba(44, 44, 84, 0.16);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.5);
}

.hero-logo {
  width: min(100%, 360px);
  height: auto;
  filter: drop-shadow(0 26px 34px rgba(31, 111, 219, 0.22));
}

.floating-card {
  position: absolute;
  max-width: 220px;
  padding: 14px 16px;
  border: 2px solid rgba(44, 44, 84, 0.12);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.92);
  color: var(--wgs-dark-outline);
  font-weight: 700;
  line-height: 1.5;
}

.floating-card-top {
  top: 24px;
  left: 16px;
}

.floating-card-bottom {
  right: 18px;
  bottom: 24px;
}

.section-block {
  padding: 28px;
}

.feature-banner {
  background:
    linear-gradient(120deg, rgba(46, 168, 255, 0.12), rgba(255, 197, 58, 0.18)),
    rgba(255, 255, 255, 0.9);
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
}

.section-title {
  margin: 12px 0 0;
  font-size: clamp(1.9rem, 4vw, 3rem);
  line-height: 1.05;
  font-weight: 900;
  color: var(--wgs-text-primary);
  text-wrap: balance;
}

.section-title.small {
  font-size: clamp(1.5rem, 3vw, 2.3rem);
}

.section-copy.compact {
  max-width: 20rem;
}

.mode-grid,
.benefit-grid,
.games-grid,
.spotlight-grid {
  display: grid;
  gap: 18px;
}

.mode-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.benefit-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.games-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.spotlight-grid {
  grid-template-columns: 1.1fr 0.9fr;
}

.mode-card,
.benefit-card,
.game-card {
  padding: 22px;
  border: 2px solid rgba(44, 44, 84, 0.1);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.92);
}

.mode-blue {
  background: linear-gradient(180deg, rgba(46, 168, 255, 0.14), rgba(255, 255, 255, 0.92));
}

.mode-orange {
  background: linear-gradient(180deg, rgba(255, 159, 28, 0.16), rgba(255, 255, 255, 0.92));
}

.mode-pink {
  background: linear-gradient(180deg, rgba(255, 79, 163, 0.12), rgba(255, 255, 255, 0.92));
}

.mode-green {
  background: linear-gradient(180deg, rgba(76, 217, 100, 0.14), rgba(255, 255, 255, 0.92));
}

.mode-icon,
.benefit-icon,
.game-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.76);
  font-size: 1.6rem;
}

.mode-title,
.benefit-title,
.game-title {
  margin: 16px 0 10px;
  color: var(--wgs-text-primary);
  font-size: 1.2rem;
  font-weight: 800;
}

.mode-list,
.spotlight-list {
  margin: 0;
  padding-left: 18px;
  color: var(--wgs-text-primary);
  line-height: 1.8;
}

.benefit-card {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(245, 247, 250, 0.96));
}

.game-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.game-card-top {
  display: flex;
  gap: 14px;
  align-items: center;
}

.game-meta {
  min-width: 0;
}

.game-title {
  margin: 0;
}

.game-tag {
  margin: 6px 0 0;
  color: var(--wgs-text-secondary);
  font-size: 0.92rem;
}

.game-link {
  width: fit-content;
  padding: 0;
  color: var(--wgs-deep-blue);
  font-weight: 800;
}

.spotlight-card {
  padding: 28px;
}

.trophy-card {
  background:
    radial-gradient(circle at top right, rgba(255, 197, 58, 0.22), transparent 30%),
    rgba(255, 255, 255, 0.9);
}

.player-card {
  background:
    radial-gradient(circle at top left, rgba(255, 79, 163, 0.18), transparent 30%),
    rgba(255, 255, 255, 0.9);
}

.final-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  background:
    linear-gradient(135deg, rgba(46, 168, 255, 0.16), rgba(255, 197, 58, 0.2)),
    rgba(255, 255, 255, 0.9);
}

.final-cta-copy {
  max-width: 42rem;
}

.landing-footer {
  padding: 12px 8px 0;
  color: var(--wgs-text-secondary);
  font-size: 0.95rem;
  font-weight: 700;
  text-align: center;
}

@media (max-width: 1100px) {
  .mode-grid,
  .benefit-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .games-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .hero-section,
  .spotlight-grid,
  .final-cta {
    grid-template-columns: 1fr;
  }

  .hero-section {
    padding: 24px;
  }

  .hero-visual {
    min-height: 320px;
  }

  .section-heading,
  .final-cta {
    align-items: start;
  }
}

@media (max-width: 700px) {
  .landing-page {
    padding: 20px 14px 48px;
  }

  .mode-grid,
  .benefit-grid,
  .games-grid {
    grid-template-columns: 1fr;
  }

  .section-block,
  .hero-section,
  .spotlight-card {
    border-radius: 24px;
    padding: 20px;
  }

  .floating-card {
    position: static;
    max-width: none;
  }

  .hero-visual {
    gap: 12px;
    flex-direction: column;
    padding: 16px;
  }
}
</style>
