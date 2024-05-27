'use client';
import React from 'react';
import styles from './Keys.module.css';
import Key from './Key/Key';
import { useGlobalStore } from '@/stores/global';

const Keys = () => {
  const { keys, centerLetter } = useGlobalStore();
  const copiedKeys = [...keys];

  const getNextKey = () => {
    const key = copiedKeys.shift();
    if (key === centerLetter) return getNextKey();
    return key;
  };

  return (
    <div className={styles.keysContainer}>
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
