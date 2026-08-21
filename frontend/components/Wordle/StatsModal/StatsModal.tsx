import React, { useMemo, useCallback } from 'react';
import { useModalStore } from '@/stores/modalStore';
import { useGameStore } from '@/stores/Wordle/gameStore';
import { useInputStore } from '@/stores/Wordle/inputStore';
import { Box, Button, Flex, Group, Modal, Stack, Text } from '@mantine/core';
import toast from 'react-hot-toast';
import { MdOutlineCreate, MdOutlineShare } from 'react-icons/md';
import StatBox from './components/StatBox';
import WinStatsBar from './components/WinStatsBar';
import { fetcher } from '@/lib/fetcher';

const StatsModal = () => {
  const { openModal, setOpenModal } = useModalStore();
  const { hasWon, stats, enteredWords, results, applyGameState } = useGameStore();
  const { resetInput } = useInputStore();

  const allWinsCount = useMemo(
    () =>
      Object.values(stats?.winStats || {}).reduce((acc, curr) => acc + curr, 0),
    [stats]
  );

  const guessDistributionWidth = useMemo(
    () =>
      Object.values(stats?.winStats || {}).map(
        (val) => (val / allWinsCount) * 100
      ),
    [allWinsCount, stats]
  );

  const guessesAmount = enteredWords.length;

  const shareGame = useCallback(() => {
    const answersBoard = results.map((spots) =>
      spots.map((spot) => {
        if (spot === 'CORRECT') return '🟩';
        if (spot === 'PRESENT') return '🟨';
        return '⬛';
      })
    );

    const text = hasWon
      ? `I won Wordle in ${guessesAmount}/6 guesses! 🎉`
      : `This is my Wordle game with ${guessesAmount}/6 guesses!`;

    navigator.clipboard.writeText(
      `${text}\n\n${answersBoard.map((row) => row.join('')).join('\n')}`
    );

    toast.success('Copied results to clipboard!', {
      icon: '📋',
      position: 'top-right',
    });
  }, [results, guessesAmount, hasWon]);

  const createNewGame = useCallback(async () => {
    toast.loading('Creating new game...', {
      id: 'new-game',
      position: 'top-right',
    });

    try {
      const response = await fetcher('POST')('api/wordle/game');

      setOpenModal(null);
      applyGameState(response);
      resetInput();

      toast.success('New game created!', {
        id: 'new-game',
        icon: '🎮',
        position: 'top-right',
      });
    } catch (error) {
      toast.error('Failed to create a new game', {
        id: 'new-game',
        position: 'top-right',
      });
    }
  }, [setOpenModal, resetInput, applyGameState]);

  const guessMapping = useMemo(
    () => ({
      1: 'oneGuess',
      2: 'twoGuess',
      3: 'threeGuess',
      4: 'fourGuess',
      5: 'fiveGuess',
      6: 'sixGuess',
    }),
    []
  );

  const correctGuesses = useMemo(
    () =>
      Object.values(stats?.winStats || {}).reduce(
        (acc, curr, index) => acc + curr,
        0
      ),
    [stats]
  );

  const winRatio = useMemo(
    () =>
      Math.round(((correctGuesses || 0) / (stats?.gamesPlayed || 0)) * 100) ||
      0,
    [stats]
  );

  return (
    <Modal
      opened={openModal === 'STATS'}
      onClose={() => setOpenModal(null)}
      size="sm"
      centered
      overlayProps={{
        backgroundOpacity: 0.3,
        blur: 3,
      }}
    >
      <Box>
        <Text fz="h2" ta="center">
          {hasWon ? 'Congratulations! 🎉' : 'Wordle'}
        </Text>
        <Stack>
          <Stack gap="xs">
            <Text tt="uppercase" fz="sm" mt="sm">
              Statistics
            </Text>
            <Flex justify="space-between" wrap="wrap">
              <StatBox label="Played" value={stats?.gamesPlayed || 0} />
              <StatBox label="Win %" value={winRatio} />
              <StatBox
                label="Streak"
                value={stats?.streak || 0}
                extra={(stats?.streak || 0) > 0 ? '🔥' : undefined}
              />
              <StatBox label="Total guesses" value={stats?.totalGuesses || 0} />
            </Flex>
          </Stack>
          <Stack gap="xs">
            <Text tt="uppercase" fz="sm" mt="xs">
              Guess distribution
            </Text>
            <Flex direction="column" gap="4px" w="85%">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <WinStatsBar
                  key={num}
                  guessNumber={num}
                  width={guessDistributionWidth[num - 1]}
                  count={
                    (stats?.winStats as any)?.[(guessMapping as any)[num]] || 0
                  }
                  isCurrent={hasWon && guessesAmount === num}
                />
              ))}
            </Flex>
          </Stack>
          <Group wrap="nowrap">
            <Button
              color="var(--wordle-green)"
              leftSection={<MdOutlineShare />}
              onClick={shareGame}
              variant="light"
              fullWidth
            >
              Share
            </Button>
            <Button
              color="var(--wordle-green)"
              leftSection={<MdOutlineCreate />}
              onClick={createNewGame}
              fullWidth
            >
              New Game
            </Button>
          </Group>
        </Stack>
      </Box>
    </Modal>
  );
};

export default StatsModal;
