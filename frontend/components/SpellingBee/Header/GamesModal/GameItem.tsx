import React from 'react';
import { ActionIcon, Tooltip } from '@mantine/core';
import toast from 'react-hot-toast';
import InlineKeys from '@/components/SpellingBee/InlineKeys/InlineKeys';
import Dot from '@/components/SpellingBee/Dot/Dot';
import { Game } from '@/stores/gameStore';
import { Modals } from '@/stores/modalStore';
import { MdOutlineDelete, MdOutlineShare } from 'react-icons/md';
import styles from './GamesModal.module.css';

interface GameItemProps {
  game: Game;
  currentRankName: string | undefined;
  deleteGame: (id: string) => void;
  setCurrentGame: (id: string) => void;
  setOpenModal: (modal: Modals) => void;
}

const GameItem: React.FC<GameItemProps> = ({
  game,
  currentRankName,
  deleteGame,
  setCurrentGame,
  setOpenModal,
}) => {
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(
      `${window.location.origin}/spelling-bee?invite=${game.id}`
    );
    toast.success('Game invite link copied to clipboard!', {
      icon: '📋',
      position: 'top-right',
    });
  };

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
        <InlineKeys letters={game.letters} centerLetter={game.centerLetter} />
        <div className={styles.actionButtons}>
          <Tooltip
            label="Share game"
            position="bottom"
            withArrow
            openDelay={500}
          >
            <ActionIcon color="#298de0" variant="light" onClick={handleShare}>
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
};

export default GameItem;
