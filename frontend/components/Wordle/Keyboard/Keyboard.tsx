import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './Keyboard.module.css';
import { Box } from '@mantine/core';
import { MdOutlineBackspace } from 'react-icons/md';
import Key from './Key/Key';
import { useInputStore } from '@/stores/Wordle/inputStore';
import { Spot, useGameStore } from '@/stores/Wordle/gameStore';

const keys = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
const spotRank: Record<Spot, number> = {
  NOT_IN_WORD: 0,
  PRESENT: 1,
  CORRECT: 2,
};
type KeyStates = {
  [key: string]: Spot | undefined;
};

const Keyboard: React.FC = () => {
  const [keyStates, setKeyStates] = useState<KeyStates>({});
  const { removeLetter, addLetter } = useInputStore();
  const { enteredWords, results, addWord } = useGameStore();

  const handleKeyPress = useCallback(
    (key: string) => {
      if (key === 'Enter') addWord();
      else if (key === 'Backspace') removeLetter();
      else addLetter(key);
    },
    [addLetter, addWord, removeLetter]
  );

  const handleKeyState = useCallback(() => {
    const newKeyStates: KeyStates = {};

    enteredWords.forEach((word, wordIndex) => {
      word.split('').forEach((letter, i) => {
        const spot = results[wordIndex]?.[i];
        if (!spot) return;

        const current = newKeyStates[letter];
        if (!current || spotRank[spot] > spotRank[current]) {
          newKeyStates[letter] = spot;
        }
      });
    });

    setKeyStates(newKeyStates);
  }, [enteredWords, results]);

  useEffect(() => {
    handleKeyState();
  }, [handleKeyState]);

  const renderedKeys = useMemo(
    () => (
      <Box className={styles.keyboard}>
        {keys.map((row, index) => (
          <Box key={index} className={styles.row}>
            {index === 2 && (
              <Key display="Enter" isSpecial onClick={handleKeyPress} />
            )}
            {index === 1 && <Key emptySpace />}
            {Array.from(row).map((letter, i) => (
              <Key
                key={i}
                display={letter}
                action={letter}
                onClick={handleKeyPress}
                spot={keyStates[letter]}
              />
            ))}
            {index === 1 && <Key emptySpace />}
            {index === 2 && (
              <Key
                display={<MdOutlineBackspace size={22} />}
                action="Backspace"
                isSpecial
                onClick={handleKeyPress}
              />
            )}
          </Box>
        ))}
      </Box>
    ),
    [handleKeyPress, keyStates]
  );

  return renderedKeys;
};

export default Keyboard;
