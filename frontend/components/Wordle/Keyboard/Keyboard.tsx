import React from 'react';
import styles from './Keyboard.module.css';
import { Box } from '@mantine/core';
import { MdOutlineBackspace } from 'react-icons/md';
import Key from './Key/Key';
import { useInputStore } from '@/stores/Wordle/inputStore';
import { useGameStore } from '@/stores/Wordle/gameStore';

const keys = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

const Keyboard = () => {
  const { removeLetter, addLetter } = useInputStore();
  const { addWord } = useGameStore();

  const handleKeyPress = (key: string) => {
    if (key === 'Enter') addWord();
    else if (key === 'Backspace') removeLetter();
    else addLetter(key);
  };

  return (
    <Box className={styles.keyboard}>
      {keys.map((row, index) =>
        index === 2 ? (
          <Box key={index} className={styles.row}>
            <Key letter="Enter" isSpecial onClick={handleKeyPress} />
            {Array.from(row).map((letter, i) => (
              <Key key={i} letter={letter} onClick={handleKeyPress} />
            ))}
            <Key
              letter={<MdOutlineBackspace size={22} />}
              action="Backspace"
              isSpecial
              onClick={handleKeyPress}
            />
          </Box>
        ) : (
          <Box key={index} className={styles.row}>
            {index === 1 && <Key emptySpace />}
            {Array.from(row).map((letter, i) => (
              <Key key={i} letter={letter} onClick={handleKeyPress} />
            ))}
            {index === 1 && <Key emptySpace />}
          </Box>
        )
      )}
    </Box>
  );
};

export default Keyboard;
