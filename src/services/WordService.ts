type WordDictionary = Record<string, unknown>;

export class WordService {
  private dictionaryCache: WordDictionary | null = null;
  private dictionaryLoadPromise: Promise<WordDictionary> | null = null;
  private wordsCache: string[] | null = null;
  private readonly wordsByLengthCache = new Map<number, string[]>();

  async getWords(count = 1) {
    return this.pickWords(await this.getAllWords(), count);
  }

  async getWordsByLength(count: number, length: number) {
    return this.pickWords(await this.getCachedWordsByLength(length), count);
  }

  async getAllWords() {
    if (!this.wordsCache) {
      this.wordsCache = Object.keys(await this.getDictionary());
    }

    return this.wordsCache;
  }

  async wordExists(word: string) {
    const normalizedWord = word.trim().toLowerCase();

    if (!normalizedWord) {
      return false;
    }

    return Object.hasOwn(await this.getDictionary(), normalizedWord);
  }

  private async getDictionary() {
    if (this.dictionaryCache) {
      return this.dictionaryCache;
    }

    if (!this.dictionaryLoadPromise) {
      this.dictionaryLoadPromise = import('src/dictionaries/words_dictionary.json').then(
        (module) => module.default as WordDictionary,
      );
    }

    this.dictionaryCache = await this.dictionaryLoadPromise;

    return this.dictionaryCache;
  }

  private async getCachedWordsByLength(length: number) {
    const normalizedLength = Math.trunc(length);

    if (!this.wordsByLengthCache.has(normalizedLength)) {
      this.wordsByLengthCache.set(
        normalizedLength,
        (await this.getAllWords()).filter((word) => word.length === normalizedLength),
      );
    }

    return this.wordsByLengthCache.get(normalizedLength) ?? [];
  }

  private pickWords(source: string[], count: number) {
    const normalizedCount = Math.max(0, Math.trunc(count));

    if (normalizedCount === 0 || source.length === 0) {
      return [];
    }

    const shuffledWords = [...source];

    for (let index = shuffledWords.length - 1; index > 0; index -= 1) {
      const swapIndex = this.getRandomIndex(index + 1);
      const currentWord = shuffledWords[index];
      const swapWord = shuffledWords[swapIndex];

      if (currentWord !== undefined && swapWord !== undefined) {
        shuffledWords[index] = swapWord;
        shuffledWords[swapIndex] = currentWord;
      }
    }

    return shuffledWords.slice(0, normalizedCount);
  }

  private getRandomIndex(length: number) {
    return Math.floor(Math.random() * length);
  }
}

export const wordService = new WordService();
export default wordService;
