'use client';
import React from 'react';
import styles from './Buttons.module.css';
import Button from '../Button/Button';
import { useGlobalStore } from '@/stores/global';
import { FiRefreshCcw } from 'react-icons/fi';

const Buttons = () => {
  const { removeLetter, shuffleKeys, checkWord, resetInput } = useGlobalStore();

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
