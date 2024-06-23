import { create } from 'zustand';
import { useGameStore } from './gameStore';

interface InputStore {
  input: string[];
  addLetter: (letter: string) => void;
  removeLetter: () => void;
  resetInput: () => void;
}

export const useInputStore = create<InputStore>((set, get) => ({
  input: [],
  addLetter: (letter) => {
    const gameStore = useGameStore.getState();

    if (get().input?.length < 5 && !gameStore.hasWon) set((state) => ({ input: [...state.input, letter] }));
  },
  removeLetter: () => set((state) => ({ input: state.input.slice(0, -1) })),
  resetInput: () => set({ input: [] }),
}));
