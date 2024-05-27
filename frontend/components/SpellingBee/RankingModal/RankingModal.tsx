'use client';
import React from 'react';
import styles from './RankingModal.module.css';
import clsx from 'clsx';
import Modal from '../Modal/Modal';
import { useGlobalStore } from '@/stores/global';

const RankingModal = ({ open, setOpen }: { open: boolean; setOpen: any }) => {
  const { ranks, currentRank, points } = useGlobalStore();

  const nextRank = ranks.find((rank) => rank.index === currentRank + 1);
  const genius = ranks.find((rank) => rank.index === ranks.length - 1);

  return (
    <Modal
      open={open}
      closeModal={() => setOpen(false)}
      title="Rankings"
      subtitle="Ranks are based on a percentage of possible points in a puzzle."
    >
      <div className={styles.modalContent}>
        <div className={styles.ranks}>
          {ranks.map((rank, index) =>
            points === rank.points ? (
              <div key={index} className={styles.current}>
                <div className={styles.leftContainer}>
                  <div className={styles.currentPoints}>{points}</div>
                  <div>
                    <div className={styles.title}>{rank.name}</div>
                    <div className={styles.subtitle}>
                      {(nextRank?.points || 0) - points} points to next rank,{' '}
                      {(genius?.points || 0) - points} to Genius
                    </div>
                  </div>
                </div>
                <div className={styles.points}>{rank.points}</div>
              </div>
            ) : (
              <div
                key={index}
                className={clsx(
                  styles.rank,
                  points >= rank.points && styles.achieved
                )}
              >
                <div className={styles.bullet} />
                <div className={styles.rankContent}>
                  <div className={styles.name}>{rank.name}</div>
                  <div className={styles.line} />
                  <div className={styles.points}>{rank.points}</div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </Modal>
  );
};

export default RankingModal;
