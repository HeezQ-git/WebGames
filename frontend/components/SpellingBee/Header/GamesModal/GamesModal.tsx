import React, { useEffect, useState } from 'react';
import Dot from '../../Dot/Dot';
import { Game } from '@/types/globalStore';
import styles from './GamesModal.module.css';
import { useGlobalStore } from '@/stores/global';
import { useModalStore } from '@/stores/modal';
import { fetcher } from '@/lib/fetcher';
import toast from 'react-hot-toast';
import { ActionIcon, Button, Tooltip, Modal, Group } from '@mantine/core';
import InlineKeys from '../../InlineKeys/InlineKeys';
import {
  MdOutlineAdd,
  MdOutlineDelete,
  MdOutlineRefresh,
  MdOutlineShare,
} from 'react-icons/md';

const GamesModal = () => {
  const { openModal, setOpenModal } = useModalStore();
  const [lastUpdatedGames, setLastUpdatedGames] = useState<Date | null>(null);

  const {
    isLoading,
    fetchGames,
    games,
    ranks,
    currentGame,
    resetGame,
    setCurrentGame,
  } = useGlobalStore();

  const refreshTimeLimit = 5000;

  const deleteGame = async (id: string) => {
    await toast.promise(
      fetcher('DELETE')(`api/game/${id}`),
      {
        loading: 'Deleting the game...',
        success: 'Game deleted!',
        error: 'Failed to delete the game',
      },
      { position: 'top-right' }
    );

    if (currentGame === id) resetGame();
    await fetchGames?.();
  };

  useEffect(() => {
    if (!lastUpdatedGames) return;

    const timer = setTimeout(() => {
      setLastUpdatedGames(null);
    }, refreshTimeLimit);

    return () => clearTimeout(timer);
  }, [lastUpdatedGames]);

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
              onClick={() => {
                if (lastUpdatedGames) return;

                toast.promise(
                  fetchGames?.() as any,
                  {
                    loading: 'Refreshing games...',
                    success: 'Games refreshed!',
                    error: 'Failed to refresh games',
                  },
                  { position: 'top-right' }
                );
                setLastUpdatedGames(new Date());
              }}
            >
              <MdOutlineRefresh size={18} />
            </ActionIcon>
          </Tooltip>
          <span className="modalTitle">Your games</span>
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
          {games!?.length ? <div className={styles.line} /> : null}
          <div className={styles.games}>
            {games!?.length ? (
              games!?.map((game: Game) => {
                const percentage = (game.score / game.maximumScore) * 100;

                const currentRankName = ranks.find(
                  (rank) => percentage >= rank.percentage
                )?.name;

                return (
                  <div
                    key={game.id}
                    className={styles.game}
                    onClick={() => {
                      setCurrentGame(game.id);
                      setOpenModal(null);
                    }}
                  >
                    <div className={styles.top}>
                      <InlineKeys
                        letters={game.letters}
                        centerLetter={game.centerLetter}
                      />
                      <div className={styles.actionButtons}>
                        <Tooltip
                          label="Share game"
                          position="bottom"
                          withArrow
                          openDelay={500}
                        >
                          <ActionIcon
                            color="#298de0"
                            variant="light"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(
                                `${window.location.origin}/spelling-bee?invite=${game.id}`
                              );
                              toast.success(
                                'Game invite link copied to clipboard!',
                                {
                                  icon: '📋',
                                  position: 'top-right',
                                }
                              );
                            }}
                          >
                            <MdOutlineShare size={18} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip
                          label="Delete game"
                          position="bottom"
                          withArrow
                          openDelay={500}
                        >
                          <ActionIcon
                            color="red.6"
                            variant="light"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteGame(game.id);
                            }}
                          >
                            <MdOutlineDelete size={18} />
                          </ActionIcon>
                        </Tooltip>
                      </div>
                    </div>
                    <div className={styles.bottom}>
                      <span className={styles.name}>{currentRankName}</span>
                      <Dot disableMargin achieved active score={game.score} />
                    </div>
                    <div className={styles.line} />
                  </div>
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
