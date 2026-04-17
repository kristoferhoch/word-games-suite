<template>
  <section class="wordle-game" aria-label="Wordle daily puzzle">
    <header class="game-header">
      <div>
        <p class="game-kicker">
          Daily Puzzle
        </p>
        <h1 class="game-title">
          Wordle
        </h1>
      </div>

      <div class="header-actions">
        <q-btn
          round
          flat
          color="primary"
          icon="bar_chart"
          aria-label="Open statistics"
          @click="showStats = true"
        >
          <q-tooltip>Statistics</q-tooltip>
        </q-btn>
        <q-btn
          round
          flat
          color="primary"
          icon="refresh"
          aria-label="Reset puzzle"
          @click="resetToday"
        >
          <q-tooltip>Reset puzzle</q-tooltip>
        </q-btn>
      </div>
    </header>

    <div class="status-strip" aria-live="polite">
      <span>{{ statusMessage }}</span>
      <span class="puzzle-number">#{{ puzzleNumber }}</span>
    </div>

    <div class="board" aria-label="Guess board">
      <div
        v-for="(row, rowIndex) in boardRows"
        :key="rowIndex"
        class="board-row"
        :class="{ 'is-shaking': shakingRow === rowIndex }"
      >
        <div
          v-for="(letter, colIndex) in row"
          :key="`${rowIndex}-${colIndex}`"
          class="tile"
          :class="tileClass(rowIndex, colIndex, letter)"
          :style="tileDelay(rowIndex, colIndex)"
          :aria-label="tileLabel(rowIndex, colIndex, letter)"
        >
          {{ letter }}
        </div>
      </div>
    </div>

    <div class="keyboard" aria-label="On-screen keyboard">
      <div
        v-for="(row, rowIndex) in keyboardRows"
        :key="rowIndex"
        class="keyboard-row"
      >
        <button
          v-for="key in row"
          :key="key"
          class="key"
          :class="[keyClass(key), { 'is-wide': key === 'ENTER' || key === 'BACKSPACE' }]"
          type="button"
          :aria-label="key === 'BACKSPACE' ? 'Delete letter' : key"
          @click="pressKey(key)"
        >
          <q-icon
            v-if="key === 'BACKSPACE'"
            name="backspace"
            size="20px"
          />
          <span v-else>{{ key }}</span>
        </button>
      </div>
    </div>

    <footer class="game-footer">
      <q-btn
        unelevated
        no-caps
        class="share-button"
        icon="ios_share"
        label="Share"
        :disable="!isGameOver"
        @click="shareResult"
      />
      <p>
        A five-letter word is generated when the game starts. Valid guesses use the built-in dictionary.
      </p>
    </footer>

    <q-dialog v-model="showStats">
      <q-card class="stats-dialog">
        <q-card-section class="stats-header">
          <div>
            <p class="game-kicker">
              Progress
            </p>
            <h2>Statistics</h2>
          </div>
          <q-btn
            v-close-popup
            flat
            round
            icon="close"
            aria-label="Close statistics"
          />
        </q-card-section>

        <q-card-section class="stats-grid">
          <div
            v-for="stat in statCards"
            :key="stat.label"
            class="stat-card"
          >
            <strong>{{ stat.value }}</strong>
            <span>{{ stat.label }}</span>
          </div>
        </q-card-section>

        <q-card-section>
          <h3>Guess Distribution</h3>
          <div class="distribution">
            <div
              v-for="guess in 6"
              :key="guess"
              class="distribution-row"
            >
              <span>{{ guess }}</span>
              <div class="bar-track">
                <div
                  class="bar-fill"
                  :style="{ width: distributionWidth(guess) }"
                >
                  {{ stats.distribution[guess] ?? 0 }}
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            no-caps
            label="Share Result"
            icon="ios_share"
            :disable="!isGameOver"
            @click="shareResult"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import wordService from 'src/services/WordService';

type LetterState = 'correct' | 'present' | 'absent';
type GameStatus = 'playing' | 'won' | 'lost';

interface SavedGame {
  dateKey: string;
  answer: string;
  guesses: string[];
  evaluations: LetterState[][];
  status: GameStatus;
}

interface WordleStats {
  played: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  distribution: Record<number, number>;
  lastCompletedDate: string;
}

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const GAME_STORAGE_KEY = 'wgs-wordle-game-v1';
const STATS_STORAGE_KEY = 'wgs-wordle-stats-v1';
const WORDLE_EPOCH = Date.UTC(2021, 5, 19);

const answerWords = [
  'about', 'above', 'abuse', 'actor', 'acute', 'admit', 'adopt', 'adore', 'after', 'again',
  'agent', 'agree', 'ahead', 'alarm', 'album', 'alert', 'alike', 'alive', 'allow', 'alone',
  'along', 'alter', 'amber', 'ample', 'angel', 'anger', 'angle', 'angry', 'apple', 'apply',
  'arena', 'argue', 'arise', 'asset', 'audio', 'avoid', 'award', 'aware', 'badge', 'baker',
  'basic', 'beach', 'beard', 'beast', 'began', 'begin', 'being', 'below', 'bench', 'birth',
  'black', 'blade', 'blame', 'blank', 'blast', 'blend', 'bless', 'blind', 'blink', 'block',
  'blood', 'bloom', 'board', 'boost', 'brain', 'brand', 'brave', 'bread', 'break', 'brick',
  'bring', 'broad', 'brown', 'brush', 'build', 'cabin', 'cable', 'camel', 'candy', 'carry',
  'catch', 'cause', 'chain', 'chair', 'chalk', 'champ', 'chaos', 'charm', 'chart', 'chase',
  'cheap', 'check', 'cheer', 'chest', 'chief', 'child', 'choir', 'civic', 'claim', 'class',
  'clean', 'clear', 'clerk', 'click', 'climb', 'clock', 'close', 'cloth', 'cloud', 'coach',
  'coast', 'could', 'count', 'court', 'cover', 'craft', 'crane', 'crash', 'crate', 'cream',
  'creek', 'crime', 'crisp', 'cross', 'crowd', 'crown', 'daily', 'dance', 'death', 'debug',
  'delay', 'delta', 'demon', 'depth', 'digit', 'diner', 'doubt', 'dozen', 'draft', 'drama',
  'drawn', 'dream', 'dress', 'drink', 'drive', 'eager', 'early', 'earth', 'eight', 'elder',
  'elect', 'elite', 'empty', 'enjoy', 'enter', 'equal', 'error', 'event', 'every', 'exact',
  'exist', 'extra', 'faith', 'false', 'fancy', 'favor', 'feast', 'fence', 'field', 'fifth',
  'fight', 'final', 'first', 'flame', 'flash', 'fleet', 'floor', 'fluid', 'focus', 'force',
  'forth', 'frame', 'fresh', 'front', 'frost', 'fruit', 'giant', 'given', 'glass', 'globe',
  'glory', 'grace', 'grade', 'grain', 'grand', 'grant', 'grape', 'graph', 'grasp', 'grass',
  'great', 'green', 'grief', 'grind', 'group', 'guard', 'guess', 'guest', 'guide', 'habit',
  'happy', 'heart', 'heavy', 'honey', 'honor', 'horse', 'hotel', 'house', 'human', 'ideal',
  'image', 'index', 'inner', 'input', 'issue', 'joint', 'judge', 'juice', 'knife', 'knock',
  'known', 'label', 'large', 'laser', 'later', 'laugh', 'layer', 'learn', 'lemon', 'level',
  'light', 'limit', 'local', 'logic', 'loose', 'lucky', 'lunar', 'magic', 'major', 'maker',
  'maple', 'march', 'match', 'maybe', 'metal', 'model', 'money', 'month', 'motor', 'mount',
  'mouse', 'mouth', 'music', 'never', 'night', 'noise', 'north', 'novel', 'ocean', 'offer',
  'often', 'olive', 'orbit', 'order', 'other', 'outer', 'paint', 'panel', 'paper', 'party',
  'peace', 'phase', 'phone', 'piano', 'piece', 'pilot', 'pitch', 'place', 'plain', 'plane',
  'plant', 'plate', 'point', 'pound', 'power', 'press', 'price', 'pride', 'prime', 'print',
  'prize', 'proof', 'proud', 'queen', 'quick', 'quiet', 'radio', 'raise', 'range', 'rapid',
  'ratio', 'reach', 'react', 'ready', 'realm', 'rebel', 'refer', 'reply', 'right', 'river',
  'roast', 'robot', 'rough', 'round', 'route', 'royal', 'scale', 'scene', 'scope', 'score',
  'sense', 'serve', 'shade', 'shake', 'shall', 'shape', 'share', 'sharp', 'sheep', 'sheet',
  'shelf', 'shell', 'shift', 'shine', 'shirt', 'shock', 'short', 'shown', 'sight', 'skill',
  'sleep', 'slice', 'slide', 'small', 'smart', 'smile', 'smoke', 'solid', 'solve', 'sound',
  'south', 'space', 'spare', 'spark', 'speak', 'speed', 'spend', 'spice', 'spite', 'split',
  'spoke', 'sport', 'staff', 'stage', 'stair', 'stake', 'stand', 'start', 'state', 'steam',
  'steel', 'stick', 'still', 'stock', 'stone', 'store', 'storm', 'story', 'strip', 'study',
  'style', 'sugar', 'suite', 'super', 'sweet', 'table', 'teach', 'thank', 'theme', 'there',
  'thick', 'thing', 'think', 'third', 'those', 'three', 'throw', 'tight', 'timer', 'title',
  'today', 'token', 'touch', 'tower', 'track', 'trade', 'trail', 'train', 'trend', 'trial',
  'trick', 'trust', 'truth', 'uncle', 'under', 'union', 'unity', 'until', 'upper', 'urban',
  'usual', 'vague', 'valid', 'value', 'video', 'visit', 'vital', 'voice', 'waste', 'watch',
  'water', 'wheel', 'where', 'which', 'while', 'white', 'whole', 'whose', 'woman', 'world',
  'worry', 'would', 'write', 'wrong', 'yacht', 'young',
];

const extraGuessWords = [
  'aback', 'abase', 'abbey', 'abbot', 'abhor', 'abide', 'abled', 'abode', 'abort', 'abyss',
  'acorn', 'acrid', 'admin', 'aegis', 'affix', 'afire', 'agile', 'aging', 'aglow', 'agony',
  'aisle', 'allay', 'alloy', 'aloft', 'aloha', 'amass', 'amaze', 'amend', 'amiss', 'annex',
  'antic', 'aphid', 'aping', 'arbor', 'ardor', 'armor', 'aroma', 'ascot', 'ashen', 'atlas',
  'attic', 'avail', 'avert', 'awash', 'awful', 'axiom', 'azure', 'banal', 'barge', 'baron',
  'basin', 'baton', 'bayou', 'belch', 'belie', 'berth', 'bicep', 'bilge', 'bison', 'bland',
  'bleak', 'bleed', 'blitz', 'blond', 'bluff', 'blunt', 'blurb', 'boast', 'boney', 'borne',
  'bosom', 'bowel', 'boxer', 'brace', 'braid', 'brass', 'brine', 'brisk', 'broil', 'brood',
  'broom', 'budge', 'buggy', 'bulge', 'bulky', 'caper', 'carol', 'carve', 'cease', 'cedar',
  'chaff', 'chard', 'cheat', 'chide', 'chill', 'chord', 'chuck', 'churn', 'cider', 'cinch',
  'circa', 'clack', 'clamp', 'clank', 'clash', 'clasp', 'cleat', 'cleft', 'cling', 'clink',
  'cloak', 'clone', 'clout', 'clove', 'clown', 'clued', 'cocoa', 'colon', 'comet', 'coral',
  'cough', 'coyly', 'craze', 'crept', 'cried', 'crone', 'crude', 'cruel', 'crumb', 'crush',
  'crypt', 'curio', 'cynic', 'dandy', 'datum', 'dealt', 'debut', 'decay', 'decor', 'defer',
  'deity', 'depot', 'diary', 'dicey', 'dimly', 'dodge', 'donor', 'drape', 'dread', 'dried',
  'droll', 'drove', 'duchy', 'easel', 'eaten', 'ebony', 'edict', 'elope', 'elude', 'ember',
  'enact', 'endow', 'ennui', 'ensue', 'epoch', 'evade', 'exile', 'expel', 'fable', 'facet',
  'faint', 'fairy', 'farce', 'fatal', 'feign', 'ferry', 'fetal', 'fiery', 'filmy', 'finch',
  'flair', 'flank', 'flask', 'flick', 'fling', 'flint', 'flock', 'floss', 'flung', 'folly',
  'foray', 'forge', 'frail', 'fraud', 'frill', 'frisk', 'frown', 'gauze', 'gazer', 'genre',
  'giddy', 'gipsy', 'girth', 'glyph', 'gnome', 'golem', 'gorge', 'gouge', 'graze', 'gripe',
  'groan', 'grove', 'gruel', 'gulch', 'gully', 'haste', 'haunt', 'heath', 'heist', 'hinge',
  'hippo', 'hoard', 'homer', 'hound', 'humor', 'hutch', 'icing', 'idiom', 'idler', 'igloo',
  'inert', 'ingot', 'irate', 'ivory', 'jaunt', 'jazzy', 'jelly', 'jerky', 'jolly', 'joust',
  'knead', 'kneel', 'lager', 'lance', 'latch', 'lathe', 'leach', 'leafy', 'ledge', 'leech',
  'lofty', 'lodge', 'louse', 'lowly', 'lucid', 'lurch', 'lyric', 'mango', 'mason', 'medal',
  'mercy', 'mirth', 'moist', 'molar', 'mossy', 'motto', 'nanny', 'natal', 'naval', 'needy',
  'nerve', 'niece', 'noble', 'nudge', 'nymph', 'ovary', 'oxide', 'paddy', 'palsy', 'parka',
  'paste', 'patio', 'pause', 'pecan', 'perch', 'peril', 'petal', 'piety', 'plaid', 'pleat',
  'plumb', 'plush', 'poise', 'poker', 'polar', 'polka', 'prank', 'prawn', 'prose', 'prowl',
  'punch', 'quail', 'quake', 'quark', 'quart', 'quirk', 'rabid', 'radii', 'ranch', 'raven',
  'razor', 'reign', 'relic', 'renew', 'resin', 'rhyme', 'rider', 'ridge', 'ripen', 'rival',
  'robin', 'rogue', 'rouge', 'rusty', 'sadly', 'saint', 'salon', 'satin', 'sauce', 'saucy',
  'sauna', 'scald', 'scalp', 'scamp', 'scare', 'scarf', 'scary', 'scoop', 'scout', 'scrap',
  'scrub', 'sedan', 'serum', 'shack', 'shard', 'shave', 'shirk', 'shorn', 'shrew', 'shrub',
  'sieve', 'siren', 'skate', 'skier', 'skulk', 'slack', 'slain', 'slang', 'slant', 'sleek',
  'sleet', 'slope', 'sloth', 'slump', 'smack', 'smear', 'smirk', 'snail', 'snake', 'snare',
  'sneak', 'snide', 'solar', 'sonar', 'spade', 'spawn', 'spear', 'spike', 'spine', 'spire',
  'spoil', 'spray', 'spree', 'sprig', 'spurn', 'squad', 'squat', 'stack', 'stale', 'stark',
  'steak', 'stern', 'stilt', 'stink', 'stomp', 'stout', 'straw', 'stray', 'strut', 'swarm',
  'swath', 'swirl', 'swoon', 'syrup', 'tacit', 'tacky', 'taint', 'taper', 'tarot', 'taunt',
  'tempo', 'tenor', 'terra', 'thief', 'thorn', 'tibia', 'tidal', 'toast', 'torus', 'trace',
  'tramp', 'trawl', 'tread', 'triad', 'trite', 'trope', 'truce', 'trunk', 'tulip', 'twang',
  'twine', 'twirl', 'ulcer', 'unify', 'unlit', 'unmet', 'untie', 'usher', 'utter', 'valet',
  'venom', 'verge', 'verse', 'vicar', 'villa', 'vinyl', 'viola', 'vivid', 'vodka', 'voter',
  'wager', 'waist', 'waive', 'waltz', 'weary', 'weigh', 'wharf', 'widen', 'widow', 'wince',
  'windy', 'witty', 'woken', 'woven', 'wrath', 'wrist', 'yeast', 'yield', 'zebra', 'zesty',
];

const validWords = new Set([...answerWords, ...extraGuessWords]);
const keyboardRows = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
];
const stateRank: Record<LetterState, number> = {
  absent: 1,
  present: 2,
  correct: 3,
};

const $q = useQuasar();
const todayKey = getDateKey();
const puzzleNumber = getPuzzleNumber(todayKey);
const fallbackAnswer = (answerWords[puzzleNumber % answerWords.length] ?? answerWords[0] ?? 'plant').toUpperCase();
const answer = ref('');
const isLoadingAnswer = ref(true);
const currentGuess = ref('');
const guesses = ref<string[]>([]);
const evaluations = ref<LetterState[][]>([]);
const status = ref<GameStatus>('playing');
const message = ref('');
const shakingRow = ref<number | null>(null);
const showStats = ref(false);
const stats = ref<WordleStats>(loadStats());
const isSubmittingGuess = ref(false);

const isGameOver = computed(() => status.value !== 'playing');
const boardRows = computed(() =>
  Array.from({ length: MAX_ATTEMPTS }, (_, rowIndex) => {
    const source = guesses.value[rowIndex] ?? (rowIndex === guesses.value.length ? currentGuess.value : '');

    return Array.from({ length: WORD_LENGTH }, (_, colIndex) => source[colIndex] ?? '');
  }),
);
const statusMessage = computed(() => {
  if (message.value) {
    return message.value;
  }

  if (status.value === 'won') {
    return `Solved in ${guesses.value.length}.`;
  }

  if (status.value === 'lost') {
    return `The word was ${answer.value}.`;
  }

  if (isLoadingAnswer.value) {
    return 'Choosing a word...';
  }

  if (isSubmittingGuess.value) {
    return 'Checking word...';
  }

  return `${MAX_ATTEMPTS - guesses.value.length} guesses remaining.`;
});
const keyStates = computed(() => {
  const states = new Map<string, LetterState>();

  guesses.value.forEach((guess, guessIndex) => {
    evaluations.value[guessIndex]?.forEach((state, letterIndex) => {
      const letter = guess[letterIndex] ?? '';
      const current = states.get(letter);

      if (letter && (!current || stateRank[state] > stateRank[current])) {
        states.set(letter, state);
      }
    });
  });

  return states;
});
const statCards = computed(() => [
  { label: 'Played', value: stats.value.played },
  { label: 'Win %', value: stats.value.played ? Math.round((stats.value.wins / stats.value.played) * 100) : 0 },
  { label: 'Current Streak', value: stats.value.currentStreak },
  { label: 'Max Streak', value: stats.value.maxStreak },
]);
const largestDistribution = computed(() =>
  Math.max(1, ...Object.values(stats.value.distribution)),
);

function getDateKey(date = new Date()) {
  const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getPuzzleNumber(dateKey: string) {
  const [year = '2021', month = '1', day = '1'] = dateKey.split('-');
  const current = Date.UTC(Number(year), Number(month) - 1, Number(day));

  return Math.floor((current - WORDLE_EPOCH) / 86400000) + 1;
}

function loadGame() {
  const saved = readJson<SavedGame>(GAME_STORAGE_KEY);

  if (!saved || saved.dateKey !== todayKey || !isValidAnswer(saved.answer)) {
    return false;
  }

  answer.value = saved.answer;
  guesses.value = saved.guesses;
  evaluations.value = saved.evaluations;
  status.value = saved.status;

  return true;
}

function loadStats(): WordleStats {
  return readJson<WordleStats>(STATS_STORAGE_KEY) ?? {
    played: 0,
    wins: 0,
    currentStreak: 0,
    maxStreak: 0,
    distribution: {},
    lastCompletedDate: '',
  };
}

function readJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);

    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function saveGame() {
  if (!answer.value) {
    return;
  }

  const payload: SavedGame = {
    dateKey: todayKey,
    answer: answer.value,
    guesses: guesses.value,
    evaluations: evaluations.value,
    status: status.value,
  };

  window.localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(payload));
}

function saveStats() {
  window.localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats.value));
}

function pressKey(key: string) {
  if (status.value !== 'playing' || isLoadingAnswer.value || isSubmittingGuess.value || !answer.value) {
    return;
  }

  if (key === 'ENTER') {
    void submitGuess();
    return;
  }

  if (key === 'BACKSPACE') {
    currentGuess.value = currentGuess.value.slice(0, -1);
    return;
  }

  if (/^[A-Z]$/.test(key) && currentGuess.value.length < WORD_LENGTH) {
    currentGuess.value += key;
  }
}

async function submitGuess() {
  const guess = currentGuess.value.toLowerCase();
  const solution = answer.value;

  if (!solution) {
    rejectGuess('Still choosing a word.');
    return;
  }

  if (guess.length < WORD_LENGTH) {
    rejectGuess('Not enough letters.');
    return;
  }

  isSubmittingGuess.value = true;

  try {
    if (guess !== solution.toLowerCase() && !(await wordService.wordExists(guess))) {
      rejectGuess('Not in word list.');
      return;
    }
  } catch {
    if (!validWords.has(guess) && guess !== solution.toLowerCase()) {
      rejectGuess('Not in word list.');
      return;
    }
  } finally {
    isSubmittingGuess.value = false;
  }

  const normalizedGuess = guess.toUpperCase();
  const evaluation = evaluateGuess(normalizedGuess, solution);

  guesses.value.push(normalizedGuess);
  evaluations.value.push(evaluation);
  currentGuess.value = '';

  if (normalizedGuess === solution) {
    status.value = 'won';
    message.value = 'Excellent solve.';
    recordCompletedGame(true);
    showStats.value = true;
  } else if (guesses.value.length === MAX_ATTEMPTS) {
    status.value = 'lost';
    message.value = `The word was ${solution}.`;
    recordCompletedGame(false);
    showStats.value = true;
  } else {
    message.value = '';
  }

  saveGame();
}

function rejectGuess(reason: string) {
  message.value = reason;
  shakingRow.value = guesses.value.length;

  window.setTimeout(() => {
    shakingRow.value = null;
  }, 420);
}

function evaluateGuess(guess: string, solution: string): LetterState[] {
  const result: LetterState[] = Array(WORD_LENGTH).fill('absent') as LetterState[];
  const remaining = new Map<string, number>();

  for (let index = 0; index < WORD_LENGTH; index += 1) {
    const solutionLetter = solution[index] ?? '';
    const guessLetter = guess[index] ?? '';

    if (guessLetter === solutionLetter) {
      result[index] = 'correct';
    } else {
      remaining.set(solutionLetter, (remaining.get(solutionLetter) ?? 0) + 1);
    }
  }

  for (let index = 0; index < WORD_LENGTH; index += 1) {
    if (result[index] === 'correct') {
      continue;
    }

    const guessLetter = guess[index] ?? '';
    const count = remaining.get(guessLetter) ?? 0;

    if (count > 0) {
      result[index] = 'present';
      remaining.set(guessLetter, count - 1);
    }
  }

  return result;
}

function recordCompletedGame(won: boolean) {
  if (stats.value.lastCompletedDate === todayKey) {
    return;
  }

  stats.value.played += 1;
  stats.value.lastCompletedDate = todayKey;

  if (won) {
    const guessCount = guesses.value.length;

    stats.value.wins += 1;
    stats.value.currentStreak += 1;
    stats.value.maxStreak = Math.max(stats.value.maxStreak, stats.value.currentStreak);
    stats.value.distribution[guessCount] = (stats.value.distribution[guessCount] ?? 0) + 1;
  } else {
    stats.value.currentStreak = 0;
  }

  saveStats();
}

function resetToday() {
  currentGuess.value = '';
  guesses.value = [];
  evaluations.value = [];
  status.value = 'playing';
  message.value = 'Choosing a new word...';
  showStats.value = false;
  void chooseAnswer();
}

function tileClass(rowIndex: number, colIndex: number, letter: string) {
  const evaluation = evaluations.value[rowIndex]?.[colIndex];

  return {
    'is-filled': Boolean(letter),
    'is-revealed': Boolean(evaluation),
    [`is-${evaluation}`]: Boolean(evaluation),
  };
}

function tileDelay(rowIndex: number, colIndex: number) {
  return evaluations.value[rowIndex]?.[colIndex]
    ? { animationDelay: `${colIndex * 90}ms` }
    : {};
}

function tileLabel(rowIndex: number, colIndex: number, letter: string) {
  const evaluation = evaluations.value[rowIndex]?.[colIndex];
  const stateText = evaluation ? `, ${evaluation}` : '';

  return letter ? `Row ${rowIndex + 1}, column ${colIndex + 1}, ${letter}${stateText}` : `Empty tile`;
}

function keyClass(key: string) {
  if (key === 'ENTER' || key === 'BACKSPACE') {
    return 'key-action';
  }

  const state = keyStates.value.get(key);

  return state ? `key-${state}` : '';
}

function distributionWidth(guess: number) {
  const count = stats.value.distribution[guess] ?? 0;

  return `${Math.max(count ? 12 : 7, (count / largestDistribution.value) * 100)}%`;
}

function buildShareText() {
  const score = status.value === 'won' ? guesses.value.length : 'X';
  const rows = evaluations.value
    .map((row) =>
      row
        .map((state) => {
          if (state === 'correct') {
            return '🟩';
          }

          if (state === 'present') {
            return '🟨';
          }

          return '⬛';
        })
        .join(''),
    )
    .join('\n');

  return `Wordle ${puzzleNumber} ${score}/${MAX_ATTEMPTS}\n${rows}`;
}

function isValidAnswer(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Z]{5}$/.test(value);
}

async function chooseAnswer() {
  isLoadingAnswer.value = true;

  try {
    const [selectedWord] = await wordService.getWordsByLength(1, WORD_LENGTH);
    answer.value = selectedWord?.toUpperCase() ?? fallbackAnswer;
    message.value = message.value === 'Choosing a new word...' ? 'New puzzle ready.' : '';
  } catch {
    answer.value = fallbackAnswer;
    message.value = 'Using an offline word today.';
  } finally {
    isLoadingAnswer.value = false;
    saveGame();
  }
}

function startGame() {
  if (loadGame()) {
    isLoadingAnswer.value = false;
    return;
  }

  void chooseAnswer();
}

async function shareResult() {
  if (!isGameOver.value) {
    return;
  }

  const text = buildShareText();

  try {
    await navigator.clipboard.writeText(text);
    $q.notify({
      color: 'positive',
      icon: 'check',
      message: "Results saved to your clipboard.",
    });
  } catch {
    $q.notify({
      color: 'warning',
      icon: 'content_copy',
      message: text,
      timeout: 8000,
    });
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return;
  }

  if (event.key === 'Enter') {
    event.preventDefault();
    pressKey('ENTER');
  } else if (event.key === 'Backspace' || event.key === 'Delete') {
    event.preventDefault();
    pressKey('BACKSPACE');
  } else if (/^[a-z]$/i.test(event.key)) {
    event.preventDefault();
    pressKey(event.key.toUpperCase());
  }
}

watch(currentGuess, () => {
  if (message.value && status.value === 'playing') {
    message.value = '';
  }
});

onMounted(() => {
  startGame();
  window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped lang="scss">
.wordle-game {
  display: grid;
  gap: 22px;
  width: min(720px, 100%);
  margin: 0 auto;
  padding: 24px;
  border: 2px solid rgba(44, 44, 84, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 18px 38px rgba(31, 111, 219, 0.12);
}

.game-header,
.status-strip,
.game-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.game-kicker,
.game-title,
.game-footer p,
.stats-header h2,
.stats-dialog h3 {
  margin: 0;
}

.game-kicker {
  color: var(--wgs-deep-blue);
  font-size: 0.76rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.game-title {
  margin-top: 4px;
  color: var(--wgs-text-primary);
  font-size: 2.8rem;
  font-weight: 900;
  line-height: 1;
}

.header-actions {
  display: flex;
  gap: 4px;
}

.status-strip {
  min-height: 44px;
  padding: 10px 14px;
  border: 1px solid rgba(44, 44, 84, 0.12);
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(46, 168, 255, 0.1), rgba(255, 197, 58, 0.14));
  color: var(--wgs-dark-outline);
  font-weight: 800;
}

.puzzle-number {
  color: var(--wgs-text-secondary);
  white-space: nowrap;
}

.board {
  display: grid;
  gap: 8px;
  justify-self: center;
  width: min(360px, 100%);
}

.board-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.tile {
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  border: 2px solid #d3d6da;
  border-radius: 4px;
  background: #ffffff;
  color: #1a1a1b;
  font-size: 2rem;
  font-weight: 900;
  text-transform: uppercase;
  transition:
    border-color 160ms ease,
    transform 160ms ease;
}

.tile.is-filled {
  border-color: #878a8c;
  transform: scale(1.03);
}

.tile.is-revealed {
  animation: reveal 560ms ease both;
  color: #ffffff;
}

.tile.is-correct {
  --tile-color: #6aaa64;
  border-color: #6aaa64;
}

.tile.is-present {
  --tile-color: #c9b458;
  border-color: #c9b458;
}

.tile.is-absent {
  --tile-color: #787c7e;
  border-color: #787c7e;
}

.keyboard {
  display: grid;
  gap: 8px;
  width: 100%;
}

.keyboard-row {
  display: flex;
  justify-content: center;
  gap: 6px;
}

.key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 0;
  max-width: 48px;
  min-width: 0;
  height: 58px;
  border: 0;
  border-radius: 6px;
  background: #d3d6da;
  color: #1a1a1b;
  cursor: pointer;
  font: inherit;
  font-size: 0.92rem;
  font-weight: 900;
  transition:
    background 160ms ease,
    color 160ms ease,
    transform 120ms ease;
}

.key:hover {
  transform: translateY(-1px);
}

.key:active {
  transform: translateY(1px);
}

.key.is-wide {
  max-width: 82px;
  flex-grow: 1.35;
  font-size: 0.74rem;
}

.key-correct,
.key-present,
.key-absent {
  color: #ffffff;
}

.key-correct {
  background: #6aaa64;
}

.key-present {
  background: #c9b458;
}

.key-absent {
  background: #787c7e;
}

.game-footer {
  align-items: flex-start;
}

.game-footer p {
  max-width: 28rem;
  color: var(--wgs-text-secondary);
  line-height: 1.55;
}

.share-button {
  flex: 0 0 auto;
  border-radius: 8px;
  background: var(--wgs-deep-blue);
  color: #ffffff;
  font-weight: 800;
}

.stats-dialog {
  width: min(480px, calc(100vw - 32px));
  border-radius: 8px;
}

.stats-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.stats-header h2 {
  margin-top: 4px;
  color: var(--wgs-text-primary);
  font-size: 2rem;
  font-weight: 900;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.stat-card {
  display: grid;
  gap: 4px;
  min-height: 86px;
  place-items: center;
  padding: 10px;
  border: 1px solid rgba(44, 44, 84, 0.12);
  border-radius: 8px;
  background: rgba(245, 247, 250, 0.9);
  text-align: center;
}

.stat-card strong {
  color: var(--wgs-dark-outline);
  font-size: 1.7rem;
  line-height: 1;
}

.stat-card span {
  color: var(--wgs-text-secondary);
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
}

.stats-dialog h3 {
  color: var(--wgs-text-primary);
  font-size: 1.1rem;
  font-weight: 900;
}

.distribution {
  display: grid;
  gap: 8px;
  margin-top: 12px;
}

.distribution-row {
  display: grid;
  grid-template-columns: 18px 1fr;
  align-items: center;
  gap: 10px;
  color: var(--wgs-dark-outline);
  font-weight: 900;
}

.bar-track {
  min-width: 0;
  background: #edf0f2;
}

.bar-fill {
  min-width: 24px;
  padding: 4px 8px;
  background: #6aaa64;
  color: #ffffff;
  font-size: 0.78rem;
  font-weight: 900;
  line-height: 1;
  text-align: right;
  transition: width 220ms ease;
}

.is-shaking {
  animation: shake 420ms ease;
}

@keyframes reveal {
  0% {
    transform: rotateX(0);
  }

  49% {
    background: #ffffff;
    color: #1a1a1b;
    transform: rotateX(90deg);
  }

  50% {
    background: var(--tile-color);
    color: #ffffff;
    transform: rotateX(90deg);
  }

  100% {
    background: var(--tile-color);
    transform: rotateX(0);
  }
}

@keyframes shake {
  10%,
  90% {
    transform: translateX(-1px);
  }

  20%,
  80% {
    transform: translateX(2px);
  }

  30%,
  50%,
  70% {
    transform: translateX(-4px);
  }

  40%,
  60% {
    transform: translateX(4px);
  }
}

@media (max-width: 640px) {
  .wordle-game {
    gap: 18px;
    padding: 18px 12px;
  }

  .game-header,
  .game-footer {
    align-items: stretch;
    flex-direction: column;
  }

  .header-actions {
    justify-content: flex-end;
  }

  .game-title {
    font-size: 2.25rem;
  }

  .tile {
    font-size: 1.55rem;
  }

  .keyboard-row {
    gap: 4px;
  }

  .key {
    height: 50px;
    max-width: none;
    padding: 0;
    font-size: 0.78rem;
  }

  .key.is-wide {
    max-width: none;
    font-size: 0;
  }

  .key.is-wide span {
    font-size: 0.68rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
