'use client';
import { useGlobalStore } from '@/stores/global';
import { useCallback, useEffect } from 'react';

const InputManager = () => {
  const { addLetter, removeLetter, resetInput, shuffleKeys } = useGlobalStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Backspace' || e.key === 'Delete') removeLetter();
      else if (e.key === ' ') shuffleKeys();
      else if (e.key.length === 1) addLetter(e.key.toUpperCase());
      else if (e.key === 'Enter') resetInput();
    },
    [addLetter, removeLetter, resetInput]
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
