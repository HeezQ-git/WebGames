'use client';

import React from 'react';
import clsx from 'clsx';
import { useInputStore } from '@/stores/inputStore';
import styles from './Input.module.css';

const Input: React.FC = () => {
  const { keys, centerLetter, input } = useInputStore();
  const started = true;

  return (
    <div className={clsx(styles.container, !started && styles.moveCursor)}>
      {started ? (
        input.map((letter, index) => (
          <span
            className={clsx(
              styles.letter,
              !keys.includes(letter) && styles.invalidLetter,
              centerLetter === letter && styles.goldenLetter
            )}
            key={index}
          >
            {letter}
          </span>
        ))
      ) : (
        <span className={styles.blank}>Type or click</span>
      )}
    </div>
  );
};

export default Input;
