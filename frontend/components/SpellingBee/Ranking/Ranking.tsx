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
  const { ranks, ranksPoints, currentRank, points } = useGlobalStore();
  const currentRankName = ranks.find(
    (rank) => rank.index === currentRank
  )?.name;

  const nextRankPoints =
    ranksPoints.find((r) => r.index === currentRank + 1)?.points || 0;
  const nextRankName = ranks.find(
    (rank) => rank.index === currentRank + 1
  )?.name;

  return (
    <>
      <div className={styles.ranking} onClick={() => setOpen(true)}>
        <div className={styles.current}>
          <span className={styles.title}>{currentRankName}</span>
          {currentRankName !== 'Genius' ? (
            <span className={styles.subtitle}>
              {nextRankPoints - points} to {nextRankName}
            </span>
          ) : null}
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
