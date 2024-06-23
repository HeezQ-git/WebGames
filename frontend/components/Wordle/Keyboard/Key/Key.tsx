import React from 'react';
import styles from './Key.module.css';
import { UnstyledButton } from '@mantine/core';
import clsx from 'clsx';

const Key = ({
  letter,
  isSpecial,
  emptySpace,
  spot,
  onClick,
  action,
}: {
  letter?: string | React.ReactNode;
  isSpecial?: boolean;
  emptySpace?: boolean;
  spot?: 'CORRECT' | 'PRESENT' | 'NOT_IN_WORD';
  onClick?: (key: string) => void;
  action?: string;
}) => {
  return (
    <UnstyledButton
      className={clsx(
        emptySpace && styles.emptySpace,
        !emptySpace && styles.key,
        !emptySpace && isSpecial && styles.specialKey,
        !emptySpace && spot && styles.spot,
        !emptySpace && spot === 'CORRECT' && styles.correctSpot,
        !emptySpace && spot === 'PRESENT' && styles.isPresent,
        !emptySpace && spot === 'NOT_IN_WORD' && styles.notInWord
      )}
      onClick={() => onClick && onClick(action || (letter as string))}
    >
      {letter}
    </UnstyledButton>
  );
};

export default Key;
