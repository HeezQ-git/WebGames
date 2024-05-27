'use client';
import React, { lazy, useState } from 'react';
import styles from './Ranking.module.css';
import Dot from '../Dot/Dot';
import { useGlobalStore } from '@/stores/global';
const RankingModal = lazy(
  () => import('@/components/SpellingBee/RankingModal/RankingModal')
);

const Ranking = () => {
  const [open, setOpen] = useState(false);
  const { ranks, currentRank, points } = useGlobalStore();
  const currentRankName = ranks.find(
    (rank) => rank.index === currentRank
  )?.name;

  const nextRank = ranks.find((rank) => rank.index === currentRank + 1);

  return (
    <>
      <div className={styles.ranking} onClick={() => setOpen(true)}>
        <div className={styles.current}>
          <span className={styles.title}>{currentRankName}</span>
          <span className={styles.subtitle}>
            {(nextRank?.points || 0) - points} to {nextRank?.name}
          </span>
        </div>
        <div className={styles.progress}>
          {ranks.toReversed().map((rank, index) => (
            <Dot
              key={index}
              active={currentRank === rank.index}
              achieved={currentRank > rank.index}
              score={points}
            />
          ))}
        </div>
      </div>
      <RankingModal open={open} setOpen={setOpen} />
    </>
  );
};

export default Ranking;
