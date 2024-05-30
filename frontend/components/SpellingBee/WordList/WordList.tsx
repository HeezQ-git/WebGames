'use client';
import React, { useState } from 'react';
import styles from './WordList.module.css';

import Caret from '@/assets/icons/caret';
import clsx from 'clsx';
import { useGlobalStore } from '@/stores/global';

const WordList = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { foundWords, keys } = useGlobalStore();

  const mappedWords = foundWords.map((word) => ({
    text: word,
    pangram:
      new Set(word.split('')).size === keys.length &&
      keys.includes(word[0] as string),
  }));

  const wordsElement = mappedWords.map((word, index) => (
    <span
      key={index}
      className={clsx(styles.word, word.pangram && styles.pangram)}
    >
      {word.text}
    </span>
  ));

  return (
    <div className={styles.container}>
      <div
        className={clsx(styles.wordlist, isOpen && styles.open)}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className={styles.header}>
          {!isOpen ? (
            <div className={styles.words}>
              {foundWords.length === 0 ? (
                <span className={styles.noWords}>No words found...</span>
              ) : (
                wordsElement
              )}
            </div>
          ) : (
            <p className={styles.wordsFound}>
              You have found {foundWords.length} words!
            </p>
          )}
          <Caret
            height="1.5em"
            width="1.5em"
            style={{
              transform: `rotate(${isOpen ? '180deg' : '0deg'})`,
              transition: 'transform 0.1s ease',
            }}
          />
        </div>
        {isOpen ? <div className={styles.words}>{wordsElement}</div> : null}
      </div>
    </div>
  );
};

export default WordList;
