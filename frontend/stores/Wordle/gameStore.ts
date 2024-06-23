import { create } from 'zustand';
import { useInputStore } from './inputStore';
import toast from 'react-hot-toast';
import { useAnimationStore } from './animationStore';
import { fetcher } from '@/lib/fetcher';

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

interface GameStore {
  wordList: Set<string>;
  setWordList: (words: Set<string>) => void;

  enteredWords: string[];
  setEnteredWords: (words: string[]) => void;
  addWord: () => void;

  wordToGuess: string;
  setWordToGuess: (word: string) => void;

  hasWon: boolean;
  setHasWon: (hasWon: boolean) => void;

  hasEnded: boolean;
  setHasEnded: (hasEnded: boolean) => void;

  stats: Stats | null,
  setStats: (stats: Stats) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  wordList: new Set(),
  setWordList: (words: Set<string>) => set({ wordList: words }),

  enteredWords: [],
  setEnteredWords: (words: string[]) => set({ enteredWords: words }),
  addWord: () => {
    const inputStore = useInputStore.getState();
    const word = inputStore.input.join('');
    const wordList = get().wordList;

    if (get().enteredWords.length > 5 || get().hasWon) return;
    if (word.length !== 5) return toast.error('Word must be 5 characters long', { id: 'word-error' });
    if (!wordList.has(word)) {
      toast.error('Not in word list', { id: 'word-error' });
      useAnimationStore.getState().setAnimation('shake', { duration: 300, row: get().enteredWords.length || 0, wholeRow: true })
      return;
    }

    fetcher('POST')('api/wordle/word/submit', { word })
    set((state) => ({ enteredWords: [...state.enteredWords, word] }));
    inputStore.resetInput();
  },

  wordToGuess: '',
  setWordToGuess: (word: string) => set({ wordToGuess: word }),

  hasWon: false,
  setHasWon: async (hasWon: boolean) => {
    set({ hasWon });

    if (get().hasEnded) return;

    if (hasWon) {
      const newStats = await fetcher('PATCH')('api/wordle/game/stats', { guesses: get().enteredWords.length });
      set({ stats: newStats });
    } else {
      toast.error(`The word was: ${get().wordToGuess.toUpperCase()}`, { id: 'lost', icon: '🤯', duration: 6000 });
      const newStats = await fetcher('PATCH')('api/wordle/game/stats', { guesses: 6, hasLost: true });
      set({ stats: newStats });
    }
  },

  hasEnded: false,
  setHasEnded: (hasEnded: boolean) => set({ hasEnded }),

  stats: null,
  setStats: (stats: Stats) => set({ stats }),
}));
