/* eslint-disable indent */
import React, { useEffect, useMemo, useRef } from 'react';
import styles from './Input.module.css';
import { Box } from '@mantine/core';
import InputElement from './InputElement/InputElement';
import { useGameStore } from '@/stores/Wordle/gameStore';
import { useInputStore } from '@/stores/Wordle/inputStore';
import { useAnimationStore } from '@/stores/Wordle/animationStore';
import { useModalStore } from '@/stores/modalStore';
import toast from 'react-hot-toast';

const tries = 6;
const wordLength = 5;

const Input = () => {
  const { setOpenModal } = useModalStore();
  const { input } = useInputStore();
  const { enteredWords, results, hasWon, hasEnded, wordToGuess } = useGameStore();
  const { setAnimation } = useAnimationStore();
  const announcedGame = useRef<string | null>(null);

  const inputIndexToDisplay = enteredWords.length;

  useEffect(() => {
    if (!hasEnded) return;

    const gameKey = enteredWords.join('|');
    if (announcedGame.current === gameKey) return;
    announcedGame.current = gameKey;

    if (hasWon) {
      setAnimation('jiggle', {
        duration: 750,
        row: enteredWords.length - 1,
        wholeRow: true,
      });
    } else if (wordToGuess) {
      toast.error(`The word was: ${wordToGuess.toUpperCase()}`, {
        id: 'lost',
        icon: '🤯',
        duration: 6000,
      });
    }

    const timer = setTimeout(() => setOpenModal('STATS'), 750);
    return () => clearTimeout(timer);
  }, [hasEnded, hasWon, wordToGuess, enteredWords, setAnimation, setOpenModal]);

  const renderInputRows = useMemo(
    () =>
      Array.from({ length: tries }).map((_, index) => {
        const word = enteredWords[index];
        const lettersSpots = results[index] || [];

        return (
          <Box key={index} className={styles.inputRow}>
            {Array.from({ length: wordLength }).map((_, i) => (
              <InputElement
                key={i}
                animationDelay={i * 350}
                letter={
                  word
                    ? word[i]
                    : inputIndexToDisplay === index
                    ? input[i]
                    : undefined
                }
                spot={
                  word
                    ? lettersSpots[i]
                    : inputIndexToDisplay - 1 === index
                    ? 'NOT_IN_WORD'
                    : undefined
                }
                row={index}
                letterIndex={i}
              />
            ))}
          </Box>
        );
      }),
    [enteredWords, results, input, inputIndexToDisplay]
  );

  return <Box className={styles.inputBox}>{renderInputRows}</Box>;
};

export default Input;
