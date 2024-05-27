'use client';
import React from 'react';
import styles from './Input.module.css';
import clsx from 'clsx';
import { useGlobalStore } from '@/stores/global';

const Input = () => {
  const { keys, centerLetter, input } = useGlobalStore();
  const started = true;

  // prettier-ignore
  return (
    <div className={clsx(styles.container, !started && styles.moveCursor)}>
      {started ? (
        input.map((letter, index) => {
          return (
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
          );
        })
      ) : (
        <span className={styles.blank}>Type or click</span>
      )}
    </div>
  );
};

export default Input;
