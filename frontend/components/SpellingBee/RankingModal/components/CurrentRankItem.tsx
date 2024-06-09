'use client';

import React, { memo } from 'react';
import styles from '../RankingModal.module.css';
import { CurrentRankItemProps } from '../types';

const CurrentRankItem: React.FC<CurrentRankItemProps> = ({
  rank,
  points,
  nextRankPoints,
  geniusPoints,
  currentRankPoints,
}) => (
  <div className={styles.current}>
    <div className={styles.leftContainer}>
      <div className={styles.currentPoints}>{points}</div>
      <div>
        <div className={styles.title}>{rank.name}</div>
        {points >= geniusPoints ? (
          <div className={styles.subtitle}>
            You are a Genius! Congratulations!
          </div>
        ) : (
          <div className={styles.subtitle}>
            {nextRankPoints - points} points to next rank,{' '}
            {geniusPoints - points} to Genius
          </div>
        )}
      </div>
    </div>
    <div className={styles.points}>{currentRankPoints}</div>
  </div>
);

export default memo(CurrentRankItem);
