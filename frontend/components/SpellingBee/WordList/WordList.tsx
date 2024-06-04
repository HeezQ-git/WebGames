'use client';
import React, { useState } from 'react';
import styles from './WordList.module.css';

import clsx from 'clsx';
import { useGlobalStore } from '@/stores/global';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { Highlight, Tooltip, UnstyledButton } from '@mantine/core';

const WordList = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { foundWords, keys } = useGlobalStore();

  const mappedWords = foundWords
    .map((word) => ({
      text: word,
      pangram: new Set(word.split('')).size === keys.length,
    }))
    .reverse();

  const wordsElement = mappedWords.map((word, index) => (
    <Tooltip
      key={index}
      label="Pangram!"
      position="top"
      openDelay={750}
      disabled={!word.pangram}
      withArrow
    >
      <Highlight
        key={index}
        className={clsx(styles.word, word.pangram && styles.pangram)}
        highlight={word.pangram ? word.text : ' '}
        color="gold"
        component="span"
      >
        {word.text}
      </Highlight>
    </Tooltip>
  ));

  return (
    <div className={styles.container}>
      <UnstyledButton
        className={clsx(styles.wordlist, isOpen && styles.open)}
        onClick={() => setIsOpen((prev) => !prev)}
        tabIndex={0}
        role="button"
        aria-label="Toggle word list"
        aria-expanded={isOpen}
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
          <MdOutlineKeyboardArrowDown
            size={20}
            style={{
              transform: `rotate(${isOpen ? '180deg' : '0deg'})`,
              transition: 'transform 0.1s ease',
            }}
          />
        </div>
        {isOpen ? <div className={styles.words}>{wordsElement}</div> : null}
      </UnstyledButton>
    </div>
  );
};

export default WordList;
