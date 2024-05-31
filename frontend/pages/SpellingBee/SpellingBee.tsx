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
import { useOs, useViewportSize } from '@mantine/hooks';
import { useGlobalStore } from '@/stores/global';
import Image from 'next/image';
import CatImage from '@/assets/images/sad_cat.jpg';

const SpellingBee = () => {
  const { confetti } = useGlobalStore();
  const { height, width } = useViewportSize();

  const os = useOs();

  return (
    <div className={styles.container}>
      {os !== 'ios' ? (
        <>
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
        </>
      ) : (
        <div className={styles.error}>
          <Image src={CatImage} alt="Sad cat" className={styles.image} />
          <div className={styles.textContainer}>
            <h1 className={styles.title}>Uh oh!</h1>
            <h2 className={styles.subtitle}>
              Looks like you're using an iOS device.
            </h2>
            <p className={styles.text}>
              Unfortunately, this game is not supported on iOS devices.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpellingBee;
