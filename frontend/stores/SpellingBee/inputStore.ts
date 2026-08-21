import { create } from 'zustand';

export const MAX_INPUT_LENGTH = 20;

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

const shuffled = (values: string[]) => {
  const copy = [...values];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
};

export const useInputStore = create<InputStore>((set) => ({
  input: [],
  addLetter: (letter) =>
    set((state) =>
      state.input.length >= MAX_INPUT_LENGTH
        ? state
        : { input: [...state.input, letter] }
    ),
  removeLetter: () => set((state) => ({ input: state.input.slice(0, -1) })),
  resetInput: () => set({ input: [] }),
  keys: [],
  setKeys: (keys) => set({ keys: [...(keys || [])] }),
  shuffleKeys: () => set((state) => ({ keys: shuffled(state.keys) })),
  centerLetter: '',
}));
