import React from 'react';
import styles from './WordList.module.css';

import Caret from '@/assets/icons/caret';
import clsx from 'clsx';

const WordList = () => {
  const words: { text: string; pangram: boolean }[] = [
    { text: 'hello', pangram: false },
    { text: 'world', pangram: false },
    { text: 'pangram', pangram: true },
  ];

  return (
    <div className={styles.wordlist}>
      <div className={styles.words}>
        {words.length === 0 ? (
          <span className={styles.noWords}>No words found...</span>
        ) : (
          words.map((word, index) => (
            <span
              key={index}
              className={clsx(styles.word, word.pangram && styles.pangram)}
            >
              {word.text}
            </span>
          ))
        )}
      </div>
      <Caret height="1.5em" width="1.5em" />
    </div>
  );
};

export default WordList;
