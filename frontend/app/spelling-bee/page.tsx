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
import InviteModal from '@/components/SpellingBee/InviteModal/InviteModal';
import Loading from '@/components/common/Loading/Loading';
import { useGameStore } from '@/stores/gameStore';
import { useConfettiStore } from '@/stores/confettiStore';
import { Box, Container } from '@mantine/core';

const SpellingBee = () => {
  const { games, currentGame } = useGameStore();
  const { confetti } = useConfettiStore();
  const { height, width } = useViewportSize();

  return (
    <Suspense fallback={<Loading />}>
      <Container className={styles.container}>
        {games?.length !== 0 && currentGame !== '' ? (
          <Box className={styles.content}>
            <>
              <Header />
              <Box className={styles.line} />
              <Box className={styles.content}>
                <Box component="section" className={styles.top}>
                  <Ranking />
                  <WordList />
                </Box>
                <Box component="section" className={styles.bottom}>
                  <Input />
                  <Keys />
                  <Buttons />
                </Box>
              </Box>
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
          </Box>
        ) : (
          <Loading />
        )}
        <InputManager />
        <GameManager />
      </Container>
    </Suspense>
  );
};

export default SpellingBee;
