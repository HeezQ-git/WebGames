'use client';
import React from 'react';
import styles from './Header.module.css';
import Image from 'next/image';
import Logo from '@/assets/images/bee.png';
import GamesModal from './GamesModal/GamesModal';
import { useModalStore } from '@/stores/modal';
import NewGameModal from './NewGameModal/NewGameModal';
import { useGlobalStore } from '@/stores/global';
import { UnstyledButton } from '@mantine/core';

const Header = () => {
  const { fetchGames } = useGlobalStore();
  const { setIsGamesModalOpen } = useModalStore();

  return (
    <div className={styles.header}>
      <Image src={Logo} alt="Spelling Bee" className={styles.logo} />
      <UnstyledButton
        className={styles.button}
        onClick={async () => {
          await fetchGames?.();
          setIsGamesModalOpen(true);
        }}
      >
        Your games
      </UnstyledButton>
      <GamesModal />
      <NewGameModal />
    </div>
  );
};

export default Header;
