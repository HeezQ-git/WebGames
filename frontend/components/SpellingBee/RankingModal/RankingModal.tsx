'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Modal, Text, Skeleton } from '@mantine/core';
import { useGameStore } from '@/stores/SpellingBee/gameStore';
import { useRankStore } from '@/stores/SpellingBee/rankStore';
import styles from './RankingModal.module.css';
import { RankingModalProps } from './types';

const RankItem = dynamic(() => import('./components/RankItem'), {
  ssr: false,
  loading: () => <Skeleton height={20} mb="sm" />,
});

const CurrentRankItem = dynamic(() => import('./components/CurrentRankItem'), {
  ssr: false,
  loading: () => <Skeleton height={20} mb="sm" />,
});

const RankingModal: React.FC<RankingModalProps> = ({ open, setOpen }) => {
  const { points } = useGameStore();
  const { ranks, ranksPoints, currentRank } = useRankStore();

  return (
    <Modal
      opened={open}
      onClose={() => setOpen(null)}
      title={
        <div>
          <Text component="h3">Rankings</Text>
          <Text component="span" className={styles.subtitle}>
            Ranks are based on a percentage of possible points in a puzzle.
          </Text>
        </div>
      }
      size="lg"
      centered
      overlayProps={{
        backgroundOpacity: 0.3,
        blur: 3,
      }}
    >
      <div className={styles.modalContent}>
        <div className={styles.columnInfo}>
          <Text component="span">Rank</Text>
          <Text component="span">Minimum score</Text>
        </div>
        <div className={styles.ranks}>
          <Suspense fallback={<Skeleton height={8} radius="xl" />}>
            {ranks.map((rank, index) => {
              const currentRankPoints =
                ranksPoints.find((r) => r.index === rank.index)?.points || 0;

              const nextRankPoints =
                ranksPoints.find((r) => r.index === currentRank + 1)?.points ||
                0;
              const geniusPoints =
                ranksPoints.find((r) => r.index === ranks.length - 1)?.points ||
                0;

              return rank.index === currentRank ? (
                <CurrentRankItem
                  key={index}
                  rank={rank}
                  points={points}
                  nextRankPoints={nextRankPoints}
                  geniusPoints={geniusPoints}
                  currentRankPoints={currentRankPoints}
                />
              ) : (
                <RankItem
                  key={index}
                  rank={rank}
                  points={points}
                  currentRankPoints={currentRankPoints}
                />
              );
            })}
          </Suspense>
        </div>
      </div>
    </Modal>
  );
};

export default RankingModal;
