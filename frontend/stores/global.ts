import { create } from 'zustand';

interface GlobalStore {
  wordList: string[];
  setWordList: (wordList: string[]) => void;
  input: string[];
  addLetter: (letter: string) => void;
  removeLetter: () => void;
  resetInput: () => void;
  keys: string[];
  setKeys: (keys: string[]) => void;
  shuffleKeys: () => void;
  currentRank: number;
  setCurrentRank: (currentRank: number) => void;
  centerLetter: string;

  points: number;
  setPoints: (points: number) => void;
  ranks: { name: string; points: number; index: number }[];
}

export const useGlobalStore = create<GlobalStore>((set) => ({
  wordList: [],
  setWordList: (wordList) => set({ wordList }),

  input: [],
  addLetter: (letter) => set((state) => ({ input: [...state.input, letter] })),
  removeLetter: () => set((state) => ({ input: state.input.slice(0, -1) })),
  resetInput: () => set({ input: [] }),

  keys: ['L', 'O', 'V', 'E', 'R', 'S', 'B'],
  setKeys: (keys) => set({ keys }),
  shuffleKeys: () => set((state) => ({ keys: state.keys.sort(() => Math.random() - 0.5) })),
  centerLetter: 'L',

  currentRank: 2,
  setCurrentRank: (currentRank) => set({ currentRank }),

  points: 20,
  setPoints: (points) => set({ points }),

  ranks: [
    { name: 'Genius', points: 80, index: 8 },
    { name: 'Amazing', points: 70, index: 7 },
    { name: 'Great', points: 60, index: 6 },
    { name: 'Nice', points: 50, index: 5 },
    { name: 'Solid', points: 40, index: 4 },
    { name: 'Good', points: 30, index: 3 },
    { name: 'Moving Up', points: 20, index: 2 },
    { name: 'Good Start', points: 10, index: 1 },
    { name: 'Beginner', points: 0, index: 0 },
  ],
}));