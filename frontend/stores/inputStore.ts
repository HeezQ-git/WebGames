import { create } from 'zustand';

interface InputStore {
  input: string[];
  addLetter: (letter: string) => void;
  removeLetter: () => void;
  resetInput: () => void;
  keys: string[];
  setKeys: (keys: string[]) => void;
  shuffleKeys: () => void;
  centerLetter: string;
}

export const useInputStore = create<InputStore>((set) => ({
  input: [],
  addLetter: (letter) => set((state) => ({ input: [...state.input, letter] })),
  removeLetter: () => set((state) => ({ input: state.input.slice(0, -1) })),
  resetInput: () => set({ input: [] }),
  keys: [],
  setKeys: (keys) => set({ keys }),
  shuffleKeys: () => set((state) => ({ keys: state.keys.sort(() => Math.random() - 0.5) })),
  centerLetter: '',
}));
