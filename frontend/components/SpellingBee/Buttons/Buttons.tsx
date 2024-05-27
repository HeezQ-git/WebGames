'use client';
import React from 'react';
import styles from './Buttons.module.css';
import Button from '../Button/Button';
import IconRefresh from '@/assets/icons/refresh';
import { useGlobalStore } from '@/stores/global';

const Buttons = () => {
  const { removeLetter, shuffleKeys } = useGlobalStore();

  return (
    <div className={styles.buttons}>
      <Button onClick={removeLetter}>Delete</Button>
      <Button type="icon" onClick={shuffleKeys}>
        <IconRefresh />
      </Button>
      <Button>Enter</Button>
    </div>
  );
};

export default Buttons;
