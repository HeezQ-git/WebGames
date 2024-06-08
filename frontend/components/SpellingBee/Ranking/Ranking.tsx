'use client';
import React, { lazy } from 'react';
import styles from './Ranking.module.css';
import Dot from '../Dot/Dot';
import { useGlobalStore } from '@/stores/global';
import { UnstyledButton } from '@mantine/core';
import { useModalStore } from '@/stores/modal';
const RankingModal = lazy(
  () => import('@/components/SpellingBee/RankingModal/RankingModal')
);

const Ranking = () => {
  const { ranks, ranksPoints, currentRank, points } = useGlobalStore();
  const { openModal, setOpenModal } = useModalStore();

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
      <UnstyledButton
        className={styles.ranking}
        onClick={() => setOpenModal('RANKING')}
      >
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
      </UnstyledButton>
      <RankingModal open={openModal === 'RANKING'} setOpen={setOpenModal} />
    </>
  );
};

export default Ranking;
