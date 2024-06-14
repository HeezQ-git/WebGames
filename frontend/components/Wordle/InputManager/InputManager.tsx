import { useModalStore } from '@/stores/modalStore';
import { useAnimationStore } from '@/stores/Wordle/animationStore';
import { useGameStore } from '@/stores/Wordle/gameStore';
import { useInputStore } from '@/stores/Wordle/inputStore';
import { useCallback, useEffect } from 'react';

const alphabet = 'abcdefghijklmnopqrstuvwxyz';

const InputManager = () => {
  const { input, addLetter, removeLetter } = useInputStore();
  const { addWord } = useGameStore();
  const { openModal } = useModalStore();
  const { setAnimation } = useAnimationStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (openModal) return;

      if (alphabet.includes(e.key)) addLetter(e.key);
      else if (e.key === 'Backspace') removeLetter();
      else if (e.key === 'Enter') addWord();
    },
    [addLetter, removeLetter, addWord, setAnimation, openModal]
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
