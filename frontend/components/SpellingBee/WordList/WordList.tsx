'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import clsx from 'clsx';
import { Box, UnstyledButton } from '@mantine/core';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { useMappedWords } from './hooks/useMappedWords';
import styles from './WordList.module.css';
import { WordListContentProps, WordListHeaderProps } from './types';
import { useGameStore } from '@/stores/gameStore';

const WordItem = dynamic(() => import('./WordItem/WordItem'), {
  ssr: false,
});

const WordList: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { foundWords } = useGameStore();
  const mappedWords = useMappedWords();

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
          <WordListHeader
            isOpen={isOpen}
            foundWords={foundWords}
            mappedWords={mappedWords}
          />
          <MdOutlineKeyboardArrowDown
            size={20}
            style={{
              transform: `rotate(${isOpen ? '180deg' : '0deg'})`,
              transition: 'transform 0.1s ease',
            }}
          />
        </div>
        {isOpen && <WordListContent mappedWords={mappedWords} />}
      </UnstyledButton>
    </div>
  );
};

const WordListHeader: React.FC<WordListHeaderProps> = ({
  isOpen,
  foundWords,
  mappedWords,
}) =>
  !isOpen ? (
    <Box className={styles.words}>
      {foundWords.length === 0 ? (
        <span className={styles.noWords}>No words found...</span>
      ) : (
        mappedWords?.map((word, index) => <WordItem key={index} word={word} />)
      )}
    </Box>
  ) : (
    <p className={styles.wordsFound}>
      You have found {foundWords.length} words!
    </p>
  );

const WordListContent: React.FC<WordListContentProps> = ({ mappedWords }) => (
  <div className={styles.words}>
    {mappedWords.map((word, index) => (
      <WordItem key={index} word={word} />
    ))}
  </div>
);

export default WordList;
