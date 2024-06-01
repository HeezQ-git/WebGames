import React from 'react';
import Dot from '../../Dot/Dot';
import { Game } from '@/types/globalStore';
import Modal from '../../Modal/Modal';
import styles from './GamesModal.module.css';
import { useGlobalStore } from '@/stores/global';
import { useModalStore } from '@/stores/modal';
import { fetcher } from '@/lib/fetcher';
import toast from 'react-hot-toast';
import { ActionIcon, Button, Tooltip } from '@mantine/core';
import InlineKeys from '../../InlineKeys/InlineKeys';
import { MdOutlineAdd, MdOutlineDelete, MdOutlineShare } from 'react-icons/md';

const GamesModal = () => {
  const { isGamesModalOpen, setIsGamesModalOpen, setIsNewGameModalOpen } =
    useModalStore();
  const {
    isLoading,
    fetchGames,
    games,
    ranks,
    ranksPoints,
    currentGame,
    resetGame,
    setCurrentGame,
  } = useGlobalStore();

  const deleteGame = async (id: string) => {
    await toast.promise(fetcher('DELETE')(`api/game/${id}`), {
      loading: 'Deleting the game...',
      success: 'Game deleted!',
      error: 'Failed to delete the game',
    });

    if (currentGame === id) resetGame();
    await fetchGames?.();
  };

  return (
    <Modal
      classNames={[styles.modal]}
      open={isGamesModalOpen}
      closeModal={() => setIsGamesModalOpen(false)}
      title="Your games"
      subtitle="Choose an existing game to play or create a new one."
      noContentPadding
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
                      setIsGamesModalOpen(false);
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
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(
                                `${window.location.origin}/spelling-bee/invite/${game.id}`
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
                            color="red"
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
          leftSection={<MdOutlineAdd size={22} />}
          onClick={() => {
            setIsGamesModalOpen(false);
            setIsNewGameModalOpen(true);
          }}
        >
          New Game
        </Button>
      </div>
    </Modal>
  );
};

export default GamesModal;
