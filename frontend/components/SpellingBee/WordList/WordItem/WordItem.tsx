'use client';

import React, { memo } from 'react';
import { Tooltip, Highlight, Text } from '@mantine/core';
import clsx from 'clsx';
import styles from './WordItem.module.css';
import { Word } from '../types';

interface WordItemProps {
  word: Word;
}

const WordItem: React.FC<WordItemProps> = ({ word }) => {
  return word.pangram ? (
    <Tooltip label="Pangram!" position="top" openDelay={750} withArrow>
      <Highlight
        className={clsx(styles.word, word.pangram && styles.pangram)}
        highlight={word.pangram ? word.text : ' '}
        color="gold"
        component="span"
      >
        {word.text}
      </Highlight>
    </Tooltip>
  ) : (
    <Text className={styles.word} component="span">
      {word.text}
    </Text>
  );
};

export default memo(WordItem);
