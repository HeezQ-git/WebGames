'use client';
import React, { Suspense } from 'react';
import styles from './page.module.css';

import Loading from '@/components/common/Loading/Loading';
import { Box, Container } from '@mantine/core';
import Input from '@/components/Wordle/Input/Input';
import Keyboard from '@/components/Wordle/Keyboard/Keyboard';
import InputManager from '@/components/Wordle/InputManager/InputManager';

const Wordle = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Container p="xs" className={styles.container}>
        <Box className={styles.content}>
          <Input />
          <Keyboard />
        </Box>
        <InputManager />
      </Container>
    </Suspense>
  );
};

export default Wordle;
