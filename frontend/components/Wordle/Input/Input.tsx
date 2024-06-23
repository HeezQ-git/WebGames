/* eslint-disable indent */
import React, { useEffect, useMemo, useCallback } from 'react';
import styles from './Input.module.css';
import { Box } from '@mantine/core';
import InputElement from './InputElement/InputElement';
import { useGameStore } from '@/stores/Wordle/gameStore';
import { useInputStore } from '@/stores/Wordle/inputStore';
import { useAnimationStore } from '@/stores/Wordle/animationStore';
import { getSpotValues } from '@/lib/Wordle/spotFunctions';
import { useModalStore } from '@/stores/modalStore';

const tries = 6;

const Input = () => {
  const { setOpenModal } = useModalStore();
  const { input } = useInputStore();
  const { enteredWords, wordToGuess, hasWon, setHasWon } = useGameStore();
  const { setAnimation } = useAnimationStore();

  const inputIndexToDisplay = enteredWords.length;

  const handleGameEnd = useCallback(
    (won: boolean) => {
      setHasWon(won);
      setTimeout(() => {
        setOpenModal('STATS');
      }, 750);
    },
    [setHasWon, setOpenModal]
  );

  useEffect(() => {
    const latestWord = enteredWords?.[enteredWords?.length - 1];
    if (!latestWord || hasWon) return;

    if (enteredWords.length === tries) {
      handleGameEnd(false);
      return;
    }

    const spots = getSpotValues(latestWord || '', wordToGuess);

    if (spots.every((spot) => spot === 'CORRECT')) {
      setHasWon(true);
      setTimeout(() => {
        setAnimation('jiggle', {
          duration: 750,
          row: enteredWords.length - 1,
          wholeRow: true,
        });
        setTimeout(() => {
          setOpenModal('STATS');
        }, 750);
      }, 350 * 6);
    }
  }, [
    enteredWords,
    wordToGuess,
    hasWon,
    handleGameEnd,
    setAnimation,
    setOpenModal,
  ]);

  const renderInputRows = useMemo(() => {
    return Array.from({ length: tries }).map((_, index) => {
      const word = enteredWords[index];
      const lettersSpots = word ? getSpotValues(word, wordToGuess) : [];

      return (
        <Box key={index} className={styles.inputRow}>
          {Array.from({ length: 5 }).map((_, i) => (
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
    });
  }, [enteredWords, wordToGuess, input, inputIndexToDisplay]);

  return <Box className={styles.inputBox}>{renderInputRows}</Box>;
};

export default Input;
