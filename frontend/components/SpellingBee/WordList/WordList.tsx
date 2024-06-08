/* eslint-disable indent */
'use client';
import React, { useMemo, useState } from 'react';
import styles from './WordList.module.css';

import clsx from 'clsx';
import { useGlobalStore } from '@/stores/global';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { Box, Highlight, Text, Tooltip, UnstyledButton } from '@mantine/core';

const WordList = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { foundWords, keys, session } = useGlobalStore();

  const mappedWords = useMemo(
    () =>
      foundWords
        .map((word) => ({
          text: word,
          pangram: new Set(word.split('')).size === keys.length,
        }))
        .sort((a, b) => {
          const sortBy =
            session?.data?.user?.settings?.wordListSortBy || 'ALPHABETICAL';

          switch (sortBy) {
            case 'LATEST_FIRST':
              return foundWords.indexOf(b.text) - foundWords.indexOf(a.text);
            case 'OLDEST_FIRST':
              return foundWords.indexOf(a.text) - foundWords.indexOf(b.text);
            case 'ALPHABETICAL':
            default:
              return a.text.localeCompare(b.text);
          }
        }),
    [foundWords, keys, session]
  );

  const wordsElement = useMemo(
    () =>
      mappedWords.map((word, index) =>
        !word.pangram ? (
          <Text key={index} className={styles.word} component="span">
            {word.text}
          </Text>
        ) : (
          <Tooltip
            key={index}
            label="Pangram!"
            position="top"
            openDelay={750}
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
        )
      ),
    [mappedWords]
  );

  return (
    <div className={styles.container}>
      <UnstyledButton
        className={clsx(styles.wordlist, isOpen && styles.open)}
        onClick={() => setIsOpen((prev) => !prev)}
        tabIndex={0}
        role="button"
        data-testid="wordlist"
        aria-label="Toggle word list"
        aria-expanded={isOpen}
      >
        <div className={styles.header}>
          {!isOpen ? (
            <Box className={styles.words}>
              {foundWords.length === 0 ? (
                <span className={styles.noWords}>No words found...</span>
              ) : (
                wordsElement
              )}
            </Box>
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
