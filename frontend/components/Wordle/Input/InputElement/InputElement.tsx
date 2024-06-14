import React, { useState, useEffect } from 'react';
import styles from './InputElement.module.css';
import { Box } from '@mantine/core';
import clsx from 'clsx';

const InputElement = ({
  letter,
  spot,
  animationDelay,
}: {
  letter: string | undefined;
  spot: 'CORRECT' | 'PRESENT' | 'NOT_IN_WORD' | undefined;
  animationDelay: number;
}) => {
  const [cachedSpot, setCachedSpot] = useState(spot);
  const [cachedLetter, setCachedLetter] = useState(letter);
  const [currentAnimation, setCurrentAnimation] = useState<string | null>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    if (cachedLetter !== letter && letter) {
      setCurrentAnimation('popIn');

      timeout = setTimeout(() => {
        setCachedLetter(letter);
        setCurrentAnimation('idle');
      }, 100);
    } else if (!letter) {
      setCurrentAnimation('idle');
      setCachedLetter(undefined);
    } else if (cachedSpot !== spot) {
      let timeout: NodeJS.Timeout | null = null;

      setTimeout(() => {
        setCurrentAnimation('flipOut');

        timeout = setTimeout(() => {
          setCachedSpot(spot);
          setCurrentAnimation('flipIn');
        }, 250);
      }, animationDelay);
    }
    return () => clearTimeout(timeout as NodeJS.Timeout);
  }, [spot, letter, cachedSpot, cachedLetter]);

  return (
    <Box className={styles.inputElementContainer}>
      <Box
        className={clsx(
          styles.inputElement,
          currentAnimation === 'idle' && styles.idle,
          currentAnimation === 'flipOut' && styles.flipOut,
          currentAnimation === 'flipIn' && styles.flipIn,
          currentAnimation === 'popIn' && styles.popIn,
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
