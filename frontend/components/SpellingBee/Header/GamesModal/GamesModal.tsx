'use client';

import React from 'react';
import { Modal, Group, Tooltip, ActionIcon, Button, Text } from '@mantine/core';
import { useModalStore } from '@/stores/modalStore';
import { useGameStore } from '@/stores/gameStore';
import { useGameActions } from './hooks/useGameActions';
import GameItem from './GameItem';
import { MdOutlineAdd, MdOutlineRefresh } from 'react-icons/md';
import styles from './GamesModal.module.css';
import { useRankStore } from '@/stores/rankStore';
import { useGlobalStore } from '@/stores/globalStore';

const GamesModal: React.FC = () => {
  const { openModal, setOpenModal } = useModalStore();
  const { isLoading } = useGlobalStore();
  const { games, setCurrentGame } = useGameStore();
  const { ranks } = useRankStore();
  const { lastUpdatedGames, deleteGame, refreshGames } = useGameActions();

  return (
    <Modal
      opened={openModal === 'GAMES'}
      onClose={() => setOpenModal(null)}
      title={
        <Group justify="center" gap="sm">
          <Tooltip
            label={
              !lastUpdatedGames
                ? 'Refresh games list'
                : 'Please wait a few seconds'
            }
          >
            <ActionIcon
              variant="outline"
              color="gray"
              disabled={!!lastUpdatedGames}
              onClick={refreshGames}
            >
              <MdOutlineRefresh size={18} />
            </ActionIcon>
          </Tooltip>
          <Text component="span" className="modalTitle">
            Your games
          </Text>
        </Group>
      }
      className={styles.modalContent}
      size="lg"
      centered
      overlayProps={{
        backgroundOpacity: 0.3,
        blur: 3,
      }}
    >
      {!isLoading ? (
        <>
          {games?.length ? <div className={styles.line} /> : null}
          <div className={styles.games}>
            {games?.length ? (
              games.map((game) => {
                const percentage = (game.score / game.maximumScore) * 100;
                const currentRankName = ranks.find(
                  (rank) => percentage >= rank.percentage
                )?.name;

                return (
                  <GameItem
                    key={game.id}
                    game={game}
                    currentRankName={currentRankName}
                    deleteGame={deleteGame}
                    setCurrentGame={setCurrentGame}
                    setOpenModal={setOpenModal}
                  />
                );
              })
            ) : (
              <div className={styles.noGames}>No games yet!</div>
            )}
          </div>
        </>
      ) : (
        <div className={styles.loading}>Loading...</div>
      )}
      <div className={styles.newGame}>
        <Button
          fullWidth
          color="gold.7"
          leftSection={<MdOutlineAdd size={22} />}
          onClick={() => setOpenModal('NEW_GAME')}
        >
          New Game
        </Button>
      </div>
    </Modal>
  );
};

export default GamesModal;
