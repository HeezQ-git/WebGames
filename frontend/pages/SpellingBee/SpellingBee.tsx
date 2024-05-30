'use client';
import React from 'react';
import styles from './SpellingBee.module.css';

import WordList from '@/components/SpellingBee/WordList/WordList';
import Input from '@/components/SpellingBee/Input/Input';
import Keys from '@/components/SpellingBee/Keys/Keys';
import Ranking from '@/components/SpellingBee/Ranking/Ranking';
import InputManager from '@/components/SpellingBee/InputManager/InputManager';
import Buttons from '@/components/SpellingBee/Buttons/Buttons';
import Header from '@/components/SpellingBee/Header/Header';
import { Toaster } from 'react-hot-toast';
import GameManager from '@/components/SpellingBee/GameManager/GameManager';
import Confetti from 'react-confetti';
import { useViewportSize } from '@mantine/hooks';
import { useGlobalStore } from '@/stores/global';

const SpellingBee = () => {
  const { confetti } = useGlobalStore();
  const { height, width } = useViewportSize();

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.line} />
      <div className={styles.content}>
        <section className={styles.top}>
          <Ranking />
          <WordList />
        </section>
        <section className={styles.bottom}>
          <Input />
          <Keys />
          <Buttons />
        </section>
      </div>
      <InputManager />
      <GameManager />
      <Toaster />
      {confetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={700}
          tweenDuration={8000}
          recycle={false}
        />
      )}
    </div>
  );
};

export default SpellingBee;
