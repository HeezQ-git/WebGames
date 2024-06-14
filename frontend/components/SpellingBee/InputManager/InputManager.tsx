'use client';

import { useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useModalStore } from '@/stores/modalStore';
import { useInputStore } from '@/stores/SpellingBee/inputStore';
import { useGameStore } from '@/stores/SpellingBee/gameStore';

const allowedKeys = [' ', 'Backspace', 'Delete', 'Enter'];

const InputManager: React.FC = () => {
  const { openModal } = useModalStore();
  const { addLetter, removeLetter, resetInput, input, shuffleKeys } =
    useInputStore();
  const { checkWord } = useGameStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (input.length > 16) {
        resetInput();
        toast.error('Too long!', {
          id: 'too-long',
        });
        return;
      }
      if (openModal) return;
      if (!/^[a-z]+$/i.test(e.key) && !allowedKeys.includes(e.key)) return;

      if (e.key === 'Backspace' || e.key === 'Delete') removeLetter();
      else if (e.key === ' ') shuffleKeys();
      else if (e.key.length === 1) addLetter(e.key.toUpperCase());
      else if (e.key === 'Enter') {
        checkWord();
        resetInput();
      }
    },
    [
      addLetter,
      removeLetter,
      resetInput,
      openModal,
      checkWord,
      shuffleKeys,
      input,
    ]
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
