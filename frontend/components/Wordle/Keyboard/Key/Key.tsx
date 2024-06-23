import React from 'react';
import styles from './Key.module.css';
import { UnstyledButton } from '@mantine/core';
import clsx from 'clsx';
import { useGameStore } from '@/stores/Wordle/gameStore';

interface KeyProps {
  display?: string | React.ReactNode;
  isSpecial?: boolean;
  emptySpace?: boolean;
  spot?: 'CORRECT' | 'PRESENT' | 'NOT_IN_WORD';
  onClick?: (key: string) => void;
  action?: string;
}

const spotClassMap = {
  CORRECT: styles.correctSpot,
  PRESENT: styles.isPresent,
  NOT_IN_WORD: styles.notInWord,
};

const Key: React.FC<KeyProps> = ({
  display,
  isSpecial,
  emptySpace,
  spot,
  onClick,
  action,
}) => {
  const { wordToGuess } = useGameStore();

  const handleClick = () => {
    if (wordToGuess && onClick) {
      onClick(action || (display as string));
    }
  };

  const classNames = clsx(
    emptySpace && styles.emptySpace,
    !emptySpace && styles.key,
    isSpecial && styles.specialKey,
    spot && styles.spot,
    spot && spotClassMap[spot],
    !wordToGuess && styles.disabled
  );

  return (
    <UnstyledButton className={classNames} onClick={handleClick}>
      {display}
    </UnstyledButton>
  );
};

export default Key;
