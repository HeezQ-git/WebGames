'use client';
import React from 'react';
import styles from './RankingModal.module.css';
import clsx from 'clsx';
import { Modal } from '@mantine/core';
import { useGlobalStore } from '@/stores/global';

const RankingModal = ({ open, setOpen }: { open: boolean; setOpen: any }) => {
  const { ranks, ranksPoints, currentRank, points } = useGlobalStore();

  return (
    <Modal
      opened={open}
      onClose={() => setOpen(false)}
      title={
        <div>
          <h3>Rankings</h3>
          <span className={styles.subtitle}>
            Ranks are based on a percentage of possible points in a puzzle.
          </span>
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
          <span>Rank</span>
          <span>Minimum score</span>
        </div>
        <div className={styles.ranks}>
          {ranks.map((rank, index) => {
            const currentRankPoints =
              ranksPoints.find((r) => r.index === rank.index)?.points || 0;

            const nextRankPoints =
              ranksPoints.find((r) => r.index === currentRank + 1)?.points || 0;
            const geniusPoints =
              ranksPoints.find((r) => r.index === ranks.length - 1)?.points ||
              0;

            return rank.index === currentRank ? (
              <div key={index} className={styles.current}>
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
            ) : (
              <div
                key={index}
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
          })}
        </div>
      </div>
    </Modal>
  );
};

export default RankingModal;
