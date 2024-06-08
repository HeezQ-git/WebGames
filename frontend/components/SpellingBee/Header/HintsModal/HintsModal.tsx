import { useGlobalStore } from '@/stores/global';
import { useModalStore } from '@/stores/modal';
import {
  Accordion,
  Code,
  Divider,
  Group,
  Modal,
  Stack,
  Switch,
  Text,
  Tooltip,
} from '@mantine/core';
import React, { useState } from 'react';

const HintsModal = () => {
  const [skipFound, setSkipFound] = useState(false);

  const { openModal, setOpenModal } = useModalStore();
  const { games, currentGame, foundWords } = useGlobalStore();
  const wordlist = games?.find((game) => game.id === currentGame)?.correctWords;

  const getTally = (amountOfLetters: number) =>
    wordlist
      ?.filter((word) => {
        if (skipFound && foundWords.includes(word?.word)) return false;
        return true;
      })
      ?.reduce((acc, word) => {
        const twoLetters = word?.word
          ?.slice(0, amountOfLetters)
          .toLocaleUpperCase();
        acc[twoLetters] = (acc[twoLetters] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

  const letterDistribution = getTally(1);

  const wordLengths =
    wordlist
      ?.map((word) => word?.word.length)
      .reduce((acc, length) => {
        acc[length] = (acc[length] || 0) + 1;
        return acc;
      }, {} as Record<number, number>) || {};

  const wordsLeft = (wordlist?.length || 0) - foundWords.length;

  const pangrams = wordlist?.filter((word) => word?.isPanagram);
  const pangramsLeft = pangrams?.filter(
    (word) => !foundWords.includes(word?.word)
  );

  const perfectPangrams = wordlist?.filter(
    (word) => new Set(word?.word).size === 7
  );
  const perfectPangramsLeft = perfectPangrams?.filter(
    (word) => !foundWords.includes(word?.word)
  );

  const bingo = !Object.values(letterDistribution).some(
    (amount) => amount === 0
  );

  return (
    <Modal
      opened={openModal === 'HINTS'}
      onClose={() => setOpenModal(null)}
      title={<Text fw="bold">Hints</Text>}
      size="lg"
      centered
      overlayProps={{
        backgroundOpacity: 0.3,
        blur: 3,
      }}
    >
      <Switch
        label="Skip words that you have already found"
        color="gold"
        onChange={() => setSkipFound((prev) => !prev)}
        checked={skipFound}
        mb="lg"
      />
      <Accordion variant="separated" defaultValue="general">
        <Accordion.Item value="general">
          <Accordion.Control icon="📖">General</Accordion.Control>
          <Accordion.Panel>
            <Stack gap="xs">
              <Code fz="md">
                {skipFound ? 'Words left' : 'Words total'}:{' '}
                {skipFound
                  ? `${wordsLeft} / ${wordlist?.length}`
                  : wordlist?.length}
              </Code>
              <Code fz="md">
                {skipFound ? 'Pangrams left' : 'Pangrams total'}:{' '}
                {skipFound ? pangramsLeft?.length : pangrams?.length}
              </Code>
              <Code fz="md">
                {skipFound ? 'Perfect pangrams left' : 'Perfect pangrams total'}
                :{' '}
                {skipFound
                  ? perfectPangramsLeft?.length
                  : perfectPangrams?.length}
              </Code>

              <Code fz="md">
                <Tooltip
                  label="A puzzle where solutions begin with every letter in the hive"
                  openDelay={250}
                >
                  <Text component="span">Bingo</Text>
                </Tooltip>
                : {bingo ? 'yes' : 'no'}
              </Code>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="distribution">
          <Accordion.Control icon="🔤">Letter distribution</Accordion.Control>
          <Accordion.Panel>
            <Divider label="Beginning of word" mb="sm" />
            <Stack gap="xs">
              {Object.entries(letterDistribution)
                .sort(([, a], [, b]) => b - a)
                .map(([letter, amount]) => (
                  <Code key={letter} fz="md">
                    {letter} x {amount}
                  </Code>
                ))}
            </Stack>
            <Divider label="Word lengths" mt="lg" mb="sm" />
            <Stack gap="xs">
              {Object.entries(wordLengths).map(([length, amount]) => (
                <Code key={length} fz="md">
                  <Tooltip label={`${length} letters`} openDelay={250}>
                    <Text component="span">{length}L</Text>
                  </Tooltip>{' '}
                  x {amount}
                </Code>
              ))}
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="tally">
          <Accordion.Control icon="📊">Letters tally</Accordion.Control>
          <Accordion.Panel>
            <Group gap="xs">
              {Object.entries(getTally(2))
                .sort(([, a], [, b]) => b - a)
                .map(([letters, amount]) => (
                  <Code key={letters} fz="md">
                    {letters} x {amount}
                  </Code>
                ))}
            </Group>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Modal>
  );
};

export default HintsModal;
