import { create } from 'zustand';

interface InputStore {
  input: string[];
  addLetter: (letter: string) => void;
  removeLetter: () => void;
  resetInput: () => void;
}

export const useInputStore = create<InputStore>((set, get) => ({
  input: [],
  addLetter: (letter) => get().input?.length < 5 ? set((state) => ({ input: [...state.input, letter] })) : null,
  removeLetter: () => set((state) => ({ input: state.input.slice(0, -1) })),
  resetInput: () => set({ input: [] }),
}));
