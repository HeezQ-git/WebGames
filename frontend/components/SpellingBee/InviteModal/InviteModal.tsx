'use client';

import React, { useEffect, useState } from 'react';
import { Button, Modal, Text } from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { fetcher, useFetcherSWR } from '@/lib/fetcher';
import InlineKeys from '../InlineKeys/InlineKeys';
import { useGameStore, Game } from '@/stores/gameStore';
import styles from './InviteModal.module.css';

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className={styles.infoRow}>
    <Text component="span" className={styles.label}>
      {label}
    </Text>
    <div className={styles.line} />
    <Text component="span" className={styles.value}>
      {value}
    </Text>
  </div>
);

const InviteModal: React.FC = () => {
  const [notified, setNotified] = useState(false);
  const [invite, setInvite] = useState<string | null>(null);
  const { games, fetchGames, setCurrentGame } = useGameStore();

  const router = useRouter();
  const searchParams = useSearchParams();
  const foundInvite = searchParams.get('invite');

  const { data: inviteGame, isLoading } = useFetcherSWR<Game>(
    'GET',
    invite ? `api/game/byId/${invite}` : undefined
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

  const handleDecline = () => {
    setInvite(null);
    router.push(`/spelling-bee`);
  };

  const handleAccept = async () => {
    await fetcher('POST')(`api/game/add-player`, { gameId: invite });
    setInvite(null);
    await fetchGames?.();
    setCurrentGame(invite!);
    toast.success('You have successfully joined the game', {
      icon: '🎉',
      position: 'top-right',
    });
    router.push(`/spelling-bee`);
  };

  return (
    <Modal
      opened={!!invite}
      onClose={() => setInvite(null)}
      title={
        <Text component="span" className="modalTitle">
          Invitation to a game
        </Text>
      }
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
          <InfoRow
            label="Words guessed"
            value={inviteGame?.enteredWords?.length}
          />
          <InfoRow label="Current score" value={inviteGame?.score} />
          <InfoRow label="Maximum score" value={inviteGame?.maximumScore} />
        </div>
        <div className={styles.buttons}>
          <Button onClick={handleDecline} color="red" variant="light" fullWidth>
            Decline
          </Button>
          <Button
            onClick={handleAccept}
            color="green"
            variant="light"
            fullWidth
          >
            Accept
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default InviteModal;
