'use client';
import React, { Suspense } from 'react';
import styles from './page.module.css';

import WordList from '@/components/SpellingBee/WordList/WordList';
import Input from '@/components/SpellingBee/Input/Input';
import Keys from '@/components/SpellingBee/Keys/Keys';
import Ranking from '@/components/SpellingBee/Ranking/Ranking';
import InputManager from '@/components/SpellingBee/InputManager/InputManager';
import Buttons from '@/components/SpellingBee/Buttons/Buttons';
import Header from '@/components/SpellingBee/Header/Header';
import GameManager from '@/components/SpellingBee/GameManager/GameManager';
import Confetti from 'react-confetti';
import { useViewportSize } from '@mantine/hooks';
import { useGlobalStore } from '@/stores/global';
import InviteModal from '@/components/SpellingBee/InviteModal/InviteModal';
import { Highlight, Loader, Stack } from '@mantine/core';

const SpellingBee = () => {
  const { games, currentGame, confetti } = useGlobalStore();
  const { height, width } = useViewportSize();

  const loadingFallback = (
    <Stack className={styles.loadingContainer} gap="sm">
      <Highlight
        fz="32px"
        ta="center"
        highlight="Loading"
        highlightStyles={{
          animation: 'loadingGradient 2s ease infinite alternate',
          backgroundImage:
            'linear-gradient(45deg, var(--mantine-color-orange-7), var(--mantine-color-yellow-5))',
          fontWeight: 700,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Loading
      </Highlight>
      <Loader size="xl" type="bars" />
    </Stack>
  );

  return (
    <Suspense fallback={loadingFallback}>
      <div className={styles.container}>
        {games?.length !== 0 && currentGame !== '' ? (
          <div className={styles.content}>
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
              <InviteModal />
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
          </div>
        ) : (
          loadingFallback
        )}
        <InputManager />
        <GameManager />
      </div>
    </Suspense>
  );
};

export default SpellingBee;
