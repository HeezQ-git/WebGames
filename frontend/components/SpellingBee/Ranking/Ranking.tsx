'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { UnstyledButton, Text } from '@mantine/core';
import styles from './Ranking.module.css';
import Dot from '../Dot/Dot';
import { useRankStore } from '@/stores/rankStore';
import { useGameStore } from '@/stores/gameStore';
import { useModalStore } from '@/stores/modalStore';

const RankingModal = dynamic(
  () => import('@/components/SpellingBee/RankingModal/RankingModal'),
  {
    ssr: false,
  }
);

const Ranking = () => {
  const { ranks, ranksPoints, currentRank } = useRankStore();
  const { points } = useGameStore();
  const { openModal, setOpenModal } = useModalStore();

  const currentRankInfo = useMemo(() => {
    const current = ranks.find((rank) => rank.index === currentRank);
    const next =
      ranksPoints.find((r) => r.index === currentRank + 1)?.points || 0;
    const nextName = ranks.find((rank) => rank.index === currentRank + 1)?.name;
    return {
      currentRankName: current?.name,
      nextRankPoints: next,
      nextRankName: nextName,
    };
  }, [ranks, ranksPoints, currentRank]);

  return (
    <>
      <UnstyledButton
        className={styles.ranking}
        onClick={() => setOpenModal('RANKING')}
      >
        <div className={styles.current}>
          <Text component="span" className={styles.title}>
            {currentRankInfo.currentRankName}
          </Text>
          {currentRankInfo.currentRankName !== 'Genius' ? (
            <Text component="span" className={styles.subtitle}>
              {currentRankInfo.nextRankPoints - points} to{' '}
              {currentRankInfo.nextRankName}
            </Text>
          ) : null}
        </div>
        <div className={styles.progress}>
          {ranks
            .slice()
            .reverse()
            .map((rank, index) => (
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
