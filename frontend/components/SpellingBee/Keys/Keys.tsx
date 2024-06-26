'use client';
import React from 'react';
import styles from './Keys.module.css';
import Key from './Key/Key';
import clsx from 'clsx';
import { useInputStore } from '@/stores/SpellingBee/inputStore';

const Keys = ({
  overrideKeys,
  disablePointers,
}: {
  overrideKeys?: string[];
  disablePointers?: boolean;
}) => {
  const { keys, centerLetter } = useInputStore();
  const copiedKeys = [...(overrideKeys || keys || [])];

  const getNextKey = (): string => {
    const key = copiedKeys.shift();
    if (key === centerLetter) return getNextKey();
    return key as string;
  };

  return (
    <div
      className={clsx(
        styles.keysContainer,
        disablePointers && styles.disablePointers
      )}
      aria-label="Keys"
      tabIndex={-1}
    >
      <div className={styles.keyRow}>
        <Key letter={getNextKey()} />
        <Key letter={getNextKey()} />
      </div>
      <div className={styles.keyRow}>
        <Key letter={getNextKey()} />
        <Key centerKey letter={centerLetter} />
        <Key letter={getNextKey()} />
      </div>
      <div className={styles.keyRow}>
        <Key letter={getNextKey()} />
        <Key letter={getNextKey()} />
      </div>
    </div>
  );
};

export default Keys;
