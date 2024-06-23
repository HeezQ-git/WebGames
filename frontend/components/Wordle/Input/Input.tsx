import React, { useCallback } from 'react';
import styles from './Input.module.css';
import { Box } from '@mantine/core';
import InputElement from './InputElement/InputElement';
import { useGameStore } from '@/stores/Wordle/gameStore';
import { useInputStore } from '@/stores/Wordle/inputStore';

const tries = 6;

const Input = () => {
  const { input } = useInputStore();
  const { enteredWords, wordToGuess } = useGameStore();

  const inputIndexToDisplay = enteredWords.length;

  const getSpotNames = useCallback(
    (guess: string) => {
      const result = new Array(guess.length).fill('NOT_IN_WORD');
      const letterCount: { [key: string]: number } = {};

      for (const letter of wordToGuess) {
        letterCount[letter] = (letterCount[letter] || 0) + 1;
      }

      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === wordToGuess[i]) {
          result[i] = 'CORRECT';
          letterCount[guess[i]]--;
        }
      }

      for (let i = 0; i < guess.length; i++) {
        if (result[i] !== 'CORRECT' && letterCount[guess[i]]) {
          result[i] = 'PRESENT';
          letterCount[guess[i]]--;
        }
      }

      return result;
    },
    [wordToGuess]
  );

  return (
    <Box className={styles.inputBox}>
      {Array.from({ length: tries }).map((_, index) => {
        const word = enteredWords[index];

        if (word) {
          const lettersSpots = getSpotNames(word);

          return (
            <Box key={index} className={styles.inputRow}>
              {Array.from({ length: 5 }).map((_, i) => (
                <InputElement
                  key={i}
                  animationDelay={i * 250}
                  letter={word[i]}
                  spot={lettersSpots[i]}
                />
              ))}
            </Box>
          );
        }

        return (
          <Box key={index} className={styles.inputRow}>
            {Array.from({ length: 5 }).map((_, i) => {
              return (
                <InputElement
                  key={i}
                  letter={inputIndexToDisplay === index ? input[i] : undefined}
                  animationDelay={i * 100}
                  spot={
                    inputIndexToDisplay - 1 === index
                      ? 'NOT_IN_WORD'
                      : undefined
                  }
                />
              );
            })}
          </Box>
        );
      })}
    </Box>
  );
};

export default Input;
