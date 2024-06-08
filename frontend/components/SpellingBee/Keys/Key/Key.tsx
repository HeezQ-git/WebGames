import React from 'react';
import styles from './Key.module.css';
import clsx from 'clsx';
import { useGlobalStore } from '@/stores/global';
import { UnstyledButton } from '@mantine/core';

const Key = ({
  centerKey,
  letter,
}: {
  centerKey?: boolean;
  letter?: string;
}) => {
  const { addLetter } = useGlobalStore();

  return (
    <UnstyledButton
      className={clsx(styles.keyBox, centerKey && styles.centerKey)}
      onClick={() => letter && addLetter(letter)}
      data-testid="key"
      tabIndex={-1}
      aria-label={letter}
      aria-disabled={!letter}
      aria-describedby={centerKey ? 'center-letter' : undefined}
    >
      <span className={styles.keyLetter}>{letter}</span>
    </UnstyledButton>
  );
};

export default Key;
