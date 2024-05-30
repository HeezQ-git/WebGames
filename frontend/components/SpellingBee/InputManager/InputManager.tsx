'use client';
import { useGlobalStore } from '@/stores/global';
import { useModalStore } from '@/stores/modal';
import { useCallback, useEffect } from 'react';

const InputManager = () => {
  const { isNewGameModalOpen, isGamesModalOpen } = useModalStore();

  const { addLetter, removeLetter, resetInput, checkWord, shuffleKeys } =
    useGlobalStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isNewGameModalOpen || isGamesModalOpen) return;

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
      isGamesModalOpen,
      isNewGameModalOpen,
      checkWord,
      shuffleKeys,
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
