import React, { useState, useEffect, useMemo } from 'react';
import styles from './InputElement.module.css';
import { Box } from '@mantine/core';
import clsx from 'clsx';
import { useAnimationStore } from '@/stores/Wordle/animationStore';

interface InputElementProps {
  letter: string | undefined;
  spot: 'CORRECT' | 'PRESENT' | 'NOT_IN_WORD' | undefined;
  animationDelay: number;
  row: number;
  letterIndex: number;
}

const InputElement: React.FC<InputElementProps> = ({
  letter,
  spot,
  animationDelay,
  row,
  letterIndex,
}) => {
  const { animationMap, setAnimation } = useAnimationStore();
  const [cachedSpot, setCachedSpot] = useState(spot);
  const [cachedLetter, setCachedLetter] = useState(letter);

  const letterAnimation = useMemo(
    () =>
      animationMap.find((a) => a.row === row && a.letterIndex === letterIndex),
    [animationMap, row, letterIndex]
  );

  useEffect(() => {
    if (!letter) {
      setAnimation('idle');
      setCachedLetter(undefined);
      setCachedSpot(undefined);
    } else if (cachedLetter !== letter) {
      setAnimation('popIn', {
        duration: 100,
        row,
        letterIndex,
      });
      setCachedLetter(letter);
    } else if (cachedSpot !== spot) {
      setTimeout(() => {
        setAnimation('flipOut', {
          duration: 150,
          row,
          letterIndex,
          continuous: true,
        });
        setTimeout(() => {
          setCachedSpot(spot);
          setAnimation('flipIn', {
            duration: 200,
            row,
            letterIndex,
          });
        }, 200);
      }, animationDelay);
    }
  }, [
    letter,
    spot,
    cachedLetter,
    cachedSpot,
    setAnimation,
    animationDelay,
    row,
    letterIndex,
  ]);

  return (
    <Box className={styles.inputElementContainer}>
      <Box
        className={clsx(
          styles.inputElement,
          styles[letterAnimation?.animation || 'idle'],
          cachedSpot === 'CORRECT' && styles.correctSpot,
          cachedSpot === 'PRESENT' && styles.isPresent,
          cachedSpot === 'NOT_IN_WORD' && styles.notInWord,
          letter && styles.hasLetter,
          cachedSpot && styles.hasSpot
        )}
      >
        {letter}
      </Box>
    </Box>
  );
};

export default InputElement;
