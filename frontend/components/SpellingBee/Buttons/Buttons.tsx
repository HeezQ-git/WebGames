'use client';
import React from 'react';
import styles from './Buttons.module.css';
import Button from '../Button/Button';
import { FiRefreshCcw } from 'react-icons/fi';
import { useInputStore } from '@/stores/SpellingBee/inputStore';
import { useGameStore } from '@/stores/SpellingBee/gameStore';

const Buttons = () => {
  const { removeLetter, shuffleKeys, resetInput } = useInputStore();
  const { checkWord } = useGameStore();

  return (
    <div className={styles.buttons}>
      <Button onClick={removeLetter}>Delete</Button>
      <Button type="icon" onClick={shuffleKeys}>
        <FiRefreshCcw size={20} />
      </Button>
      <Button
        onClick={() => {
          checkWord();
          resetInput();
        }}
      >
        Enter
      </Button>
    </div>
  );
};

export default Buttons;
