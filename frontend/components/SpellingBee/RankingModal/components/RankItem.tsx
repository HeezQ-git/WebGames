'use client';

import React, { memo } from 'react';
import clsx from 'clsx';
import styles from '../RankingModal.module.css';
import { RankItemProps } from '../types';

const RankItem: React.FC<RankItemProps> = ({
  rank,
  points,
  currentRankPoints,
}) => (
  <div
    className={clsx(
      styles.rank,
      points >= currentRankPoints && styles.achieved
    )}
  >
    <div className={styles.bullet} />
    <div className={styles.rankContent}>
      <div className={styles.name}>{rank.name}</div>
      <div className={styles.line} />
      <div className={styles.points}>{currentRankPoints}</div>
    </div>
  </div>
);

export default memo(RankItem);
