import { create } from 'zustand';
import { useInputStore } from './inputStore';
import toast from 'react-hot-toast';

interface GameStore {
  enteredWords: string[];
  addWord: () => void;

  wordToGuess: string;
  setWordToGuess: (word: string) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  enteredWords: [],
  addWord: () => {
    const inputStore = useInputStore.getState();
    const word = inputStore.input.join('');

    if (get().enteredWords.length > 5) return;
    if (word.length !== 5) return toast.error('Word must be 5 characters long');

    set((state) => ({ enteredWords: [...state.enteredWords, word] }))
    inputStore.resetInput();
  },

  wordToGuess: 'saver',
  setWordToGuess: (word: string) => set({ wordToGuess: word }),
}));
