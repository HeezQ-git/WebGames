import React from 'react';
import Key from '../../Keys/Key/Key';
import IconDeleteOutline from '@/assets/icons/delete';
import Dot from '../../Dot/Dot';
import { Game } from '@/types/globalStore';
import Modal from '../../Modal/Modal';
import styles from './GamesModal.module.css';
import { useGlobalStore } from '@/stores/global';
import IconAddOutline from '@/assets/icons/add';
import { useModalStore } from '@/stores/modal';
import { fetcher } from '@/lib/fetcher';
import toast from 'react-hot-toast';
import { ActionIcon, Button, Tooltip } from '@mantine/core';

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
                      <div className={styles.keys}>
                        <Key letter={game.centerLetter} centerKey />
                        {game.letters.map(
                          (letter) =>
                            letter !== game.centerLetter && (
                              <Key key={letter} letter={letter} />
                            )
                        )}
                      </div>
                      <Tooltip label="Delete game" position="bottom" withArrow>
                        <ActionIcon
                          color="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteGame(game.id);
                          }}
                        >
                          <IconDeleteOutline />
                        </ActionIcon>
                      </Tooltip>
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
          leftSection={<IconAddOutline />}
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
