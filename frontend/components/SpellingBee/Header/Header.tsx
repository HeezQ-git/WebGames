'use client';
import React from 'react';
import styles from './Header.module.css';
import Image from 'next/image';
import Logo from '@/assets/images/bee.png';
import GamesModal from './GamesModal/GamesModal';
import { useModalStore } from '@/stores/modal';
import NewGameModal from './NewGameModal/NewGameModal';
import { Group, UnstyledButton } from '@mantine/core';
import HintsModal from './HintsModal/HintsModal';

const Header = () => {
  const { setOpenModal } = useModalStore();

  return (
    <div className={styles.header}>
      <Image src={Logo} alt="Spelling Bee" className={styles.logo} />
      <Group gap="lg">
        <UnstyledButton
          className={styles.button}
          onClick={() => setOpenModal('HINTS')}
          aria-label="Hints"
          aria-haspopup="true"
        >
          Hints
        </UnstyledButton>
        <UnstyledButton
          className={styles.button}
          onClick={() => setOpenModal('GAMES')}
          aria-label="Games"
          aria-haspopup="true"
        >
          Your games
        </UnstyledButton>
      </Group>
      <GamesModal />
      <NewGameModal />
      <HintsModal />
    </div>
  );
};

export default Header;
