'use client';
import React from 'react';
import styles from './Header.module.css';
import Image from 'next/image';
import Logo from '@/assets/images/bee.png';
import GamesModal from './GamesModal/GamesModal';
import { useModalStore } from '@/stores/modal';
import NewGameModal from './NewGameModal/NewGameModal';

const Header = () => {
  const { setIsGamesModalOpen } = useModalStore();

  return (
    <div className={styles.header}>
      <Image src={Logo} alt="Spelling Bee" className={styles.logo} />
      <div className={styles.button} onClick={() => setIsGamesModalOpen(true)}>
        Games
      </div>
      <GamesModal />
      <NewGameModal />
    </div>
  );
};

export default Header;
