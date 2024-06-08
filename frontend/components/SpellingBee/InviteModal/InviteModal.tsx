import { useGlobalStore } from '@/stores/global';
import React, { useEffect, useState } from 'react';
import InlineKeys from '../InlineKeys/InlineKeys';
import { fetcher, useFetcherSWR } from '@/lib/fetcher';
import { Game } from '@/types/globalStore';
import styles from './InviteModal.module.css';
import { Button, Modal } from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

const InfoRow = (label: string, value: string | number) => (
  <div className={styles.infoRow}>
    <span className={styles.label}>{label}</span>
    <div className={styles.line} />
    <span className={styles.value}>{value}</span>
  </div>
);

const InviteModal = () => {
  const [notified, setNotified] = useState(false);
  const { games, currentGame, fetchGames, setCurrentGame } = useGlobalStore();
  const [invite, setInvite] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const foundInvite = searchParams.get('invite');

  const { data: inviteGame, isLoading } = useFetcherSWR<Game>(
    'GET',
    invite ? `api/game/byId/${invite}` : undefined,
    { surpressError: true }
  );

  useEffect(() => {
    if (games?.length && games?.find((game) => game.id === foundInvite)) {
      setCurrentGame(foundInvite!);
      toast.error('You are already in this game', {
        id: 'invite-error',
        position: 'top-right',
      });
      return router.push(`/spelling-bee`);
    }

    if (!isLoading && !inviteGame && foundInvite && !notified) {
      setNotified(true);
      toast.error('The game you were invited to does not exist', {
        id: 'invite-error',
        position: 'top-right',
      });
      return router.push(`/spelling-bee`);
    }

    if (foundInvite && foundInvite?.length === 24 && invite !== foundInvite) {
      setInvite(foundInvite);
      router.push(`/spelling-bee`);
    }
  }, [isLoading, inviteGame, router, foundInvite, notified]);

  if (!inviteGame) return null;

  return !isLoading && currentGame !== foundInvite && inviteGame ? (
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
          letters={inviteGame?.letters}
          centerLetter={inviteGame?.centerLetter}
        />
        <div className={styles.infoContainer}>
          {InfoRow('Words guessed', inviteGame?.enteredWords?.length)}
          {InfoRow('Current score', inviteGame?.score)}
          {InfoRow('Maximum score', inviteGame?.maximumScore)}
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
