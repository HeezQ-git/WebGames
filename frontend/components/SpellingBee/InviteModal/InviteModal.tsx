import { useGlobalStore } from '@/stores/global';
import React, { useEffect, useState } from 'react';
import InlineKeys from '../InlineKeys/InlineKeys';
import { fetcher, useFetcherSWR } from '@/lib/fetcher';
import { Game } from '@/types/globalStore';
import styles from './InviteModal.module.css';
import { Button, Modal } from '@mantine/core';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const InviteModal = () => {
  const [notified, setNotified] = useState(false);
  const { games, currentGame, invite, setInvite, fetchGames, setCurrentGame } =
    useGlobalStore();

  const router = useRouter();

  const { data: inviteGame, isLoading } = useFetcherSWR<Game>(
    'GET',
    `api/game/byId/${invite}`,
    { surpressError: true }
  );

  useEffect(() => {
    if (!isLoading && !inviteGame && invite && !notified) {
      setNotified(true);
      toast.error('The game you were invited to does not exist', {
        id: 'invite-error',
        position: 'top-right',
      });
      router.push(`/spelling-bee`);
    } else if (games?.length && games?.find((game) => game.id === invite)) {
      setInvite(null);
      setCurrentGame(invite!);
      router.push(`/spelling-bee`);
    }
  }, [isLoading, inviteGame, router, notified]);

  if (!inviteGame) return null;

  return !isLoading && currentGame !== invite ? (
    <Modal
      opened={!!invite}
      onClose={() => setInvite(null)}
      title={<span className="modalTitle">Invitation to a game</span>}
      centered
      overlayProps={{
        backgroundOpacity: 0.3,
        blur: 3,
      }}
    >
      <div className={styles.modalContent}>
        <InlineKeys
          letters={inviteGame.letters}
          centerLetter={inviteGame.centerLetter}
        />
        <div className={styles.infoContainer}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Words guessed</span>
            <div className={styles.line} />
            <span className={styles.value}>
              {inviteGame.enteredWords.length}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Current score</span>
            <div className={styles.line} />
            <span className={styles.value}>{inviteGame.score}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Maximum score</span>
            <div className={styles.line} />
            <span className={styles.value}>{inviteGame.maximumScore}</span>
          </div>
        </div>
        <div className={styles.buttons}>
          <Button
            onClick={() => {
              setInvite(null);
              router.push(`/spelling-bee`);
            }}
            color="red"
            variant="light"
            fullWidth
          >
            Decline
          </Button>
          <Button
            onClick={async () => {
              await fetcher('POST')(`api/game/add-player`, {
                gameId: invite,
              });
              setInvite(null);
              await fetchGames?.();
              setCurrentGame(invite!);
              toast.success('You have successfully joined the game', {
                icon: '🎉',
                position: 'top-right',
              });
              router.push(`/spelling-bee`);
            }}
            color="green"
            variant="light"
            fullWidth
          >
            Accept
          </Button>
        </div>
      </div>
    </Modal>
  ) : null;
};

export default InviteModal;
