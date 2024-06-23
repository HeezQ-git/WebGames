import { useModalStore } from '@/stores/modalStore';
import { useGameStore } from '@/stores/Wordle/gameStore';
import { useInputStore } from '@/stores/Wordle/inputStore';
import { useCallback, useEffect } from 'react';

const alphabet = 'abcdefghijklmnopqrstuvwxyz';

const InputManager = () => {
  const { addLetter, removeLetter } = useInputStore();
  const { addWord } = useGameStore();
  const { openModal } = useModalStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (openModal) return;

      if (alphabet.includes(e.key)) addLetter(e.key);
      else if (e.key === 'Backspace') removeLetter();
      else if (e.key === 'Enter') addWord();
    },
    [addLetter, removeLetter, addWord, openModal]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return null;
};

export default InputManager;
