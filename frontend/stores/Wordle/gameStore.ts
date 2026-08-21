import { create } from 'zustand';
import { useInputStore } from './inputStore';
import toast from 'react-hot-toast';
import { useAnimationStore } from './animationStore';
import { fetcher } from '@/lib/fetcher';

export type Spot = 'CORRECT' | 'PRESENT' | 'NOT_IN_WORD';

export type WinStats = {
  oneGuess: number;
  twoGuess: number;
  threeGuess: number;
  fourGuess: number;
  fiveGuess: number;
  sixGuess: number;
}

export type Stats = {
  winStats: WinStats;
  totalGuesses: number;
  gamesPlayed: number;
  streak: number;
}

export type GameState = {
  gameId?: string;
  enteredWords: string[];
  results: Spot[][];
  wordToGuess?: string;
  hasWon: boolean;
  hasEnded: boolean;
  stats?: Stats;
}

interface GameStore {
  wordList: Set<string>;
  setWordList: (words: Set<string>) => void;

  enteredWords: string[];
  results: Spot[][];
  addWord: () => Promise<void>;

  wordToGuess: string;

  hasWon: boolean;
  hasEnded: boolean;
  setHasEnded: (hasEnded: boolean) => void;

  stats: Stats | null;
  setStats: (stats: Stats) => void;

  applyGameState: (game: GameState) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  wordList: new Set(),
  setWordList: (words: Set<string>) => set({ wordList: words }),

  enteredWords: [],
  results: [],

  addWord: async () => {
    const inputStore = useInputStore.getState();
    const word = inputStore.input.join('');

    if (get().hasEnded || get().enteredWords.length >= 6) return;
    if (word.length !== 5) {
      toast.error('Word must be 5 characters long', { id: 'word-error' });
      return;
    }
    if (!get().wordList.has(word)) {
      toast.error('Not in word list', { id: 'word-error' });
      useAnimationStore.getState().setAnimation('shake', {
        duration: 300,
        row: get().enteredWords.length || 0,
        wholeRow: true,
      });
      return;
    }

    inputStore.resetInput();

    try {
      const game = await fetcher('POST')('api/wordle/word/submit', { word });
      get().applyGameState(game);
    } catch (error) {
      toast.error('Failed to submit the word', { id: 'word-error' });
    }
  },

  wordToGuess: '',

  hasWon: false,
  hasEnded: false,
  setHasEnded: (hasEnded: boolean) => set({ hasEnded }),

  stats: null,
  setStats: (stats: Stats) => set({ stats }),

  applyGameState: (game: GameState) =>
    set((state) => ({
      gameId: game.gameId,
      enteredWords: game.enteredWords || [],
      results: game.results || [],
      wordToGuess: game.wordToGuess || '',
      hasWon: game.hasWon || false,
      hasEnded: game.hasEnded || false,
      stats: game.stats ?? state.stats,
    })),
}));
