import React from 'react';
import styles from './SpellingBee.module.css';

import WordList from '@/components/SpellingBee/WordList/WordList';
import Input from '@/components/SpellingBee/Input/Input';
import Keys from '@/components/SpellingBee/Keys/Keys';
import Ranking from '@/components/SpellingBee/Ranking/Ranking';
import InputManager from '@/components/SpellingBee/InputManager/InputManager';
import Buttons from '@/components/SpellingBee/Buttons/Buttons';

const SpellingBee = () => {
  return (
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
      <InputManager />
    </div>
  );
};

export default SpellingBee;
