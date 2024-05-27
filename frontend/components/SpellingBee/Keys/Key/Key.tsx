import React from 'react';
import styles from './Key.module.css';
import clsx from 'clsx';
import { useGlobalStore } from '@/stores/global';

const Key = ({
  centerKey,
  letter,
}: {
  centerKey?: boolean;
  letter?: string;
}) => {
  const { addLetter } = useGlobalStore();
  return (
    <div
      className={clsx(styles.keyBox, centerKey && styles.centerKey)}
      onClick={() => addLetter(letter!)}
    >
      <span className={styles.keyLetter}>{letter}</span>
    </div>
  );
};

export default Key;
