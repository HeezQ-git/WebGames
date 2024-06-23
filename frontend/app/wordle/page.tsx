'use client';
import React, { Suspense } from 'react';
import styles from './page.module.css';

import Loading from '@/components/common/Loading/Loading';
import { Box, Container } from '@mantine/core';
import Input from '@/components/Wordle/Input/Input';
import Keyboard from '@/components/Wordle/Keyboard/Keyboard';
import InputManager from '@/components/Wordle/InputManager/InputManager';
import { useWordListManager } from '@/hooks/Wordle/useWordListManager';
import { useGameManager } from '@/hooks/Wordle/useGameManager';
import StatsModal from '@/components/Wordle/StatsModal/StatsModal';
import Header from '@/components/Wordle/Header/Header';

const Wordle = () => {
  useWordListManager();
  useGameManager();

  return (
    <Suspense fallback={<Loading />}>
      <Container p="xs" className={styles.container}>
        <Header />
        <Box className={styles.content}>
          <Input />
          <Keyboard />
        </Box>
        <InputManager />
        <StatsModal />
      </Container>
    </Suspense>
  );
};

export default Wordle;
