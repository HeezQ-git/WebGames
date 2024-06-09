'use client';

import React from 'react';
import { Accordion, Modal, Skeleton, Stack, Switch, Text } from '@mantine/core';
import { useModalStore } from '@/stores/modalStore';
import { useHintData } from './hooks/useHintData';
import dynamic from 'next/dynamic';

const GeneralHints = dynamic(() => import('./Hints/GeneralHints'), {
  ssr: false,
  loading: () => (
    <Stack gap="sm">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} height={30} />
      ))}
    </Stack>
  ),
});

const LetterDistribution = dynamic(() => import('./Hints/LetterDistribution'), {
  ssr: false,
  loading: () => (
    <Stack gap="sm">
      {Array.from({ length: 7 }).map((_, index) => (
        <Skeleton key={index} height={30} />
      ))}
    </Stack>
  ),
});

const LetterTally = dynamic(() => import('./Hints/LetterTally'), {
  ssr: false,
  loading: () => (
    <Stack gap="sm">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} height={30} />
      ))}
    </Stack>
  ),
});

const HintsModal: React.FC = () => {
  const { openModal, setOpenModal } = useModalStore();
  const {
    skipFound,
    setSkipFound,
    wordsLeft,
    wordlist,
    pangrams,
    pangramsLeft,
    perfectPangrams,
    perfectPangramsLeft,
    bingo,
    letterDistribution,
    wordLengths,
    getTally,
  } = useHintData();

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
            <GeneralHints
              skipFound={skipFound}
              wordsLeft={wordsLeft}
              wordlistLength={wordlist?.length || 0}
              pangramsLength={pangrams?.length || 0}
              pangramsLeftLength={pangramsLeft?.length || 0}
              perfectPangramsLength={perfectPangrams?.length || 0}
              perfectPangramsLeftLength={perfectPangramsLeft?.length || 0}
              bingo={bingo}
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="distribution">
          <Accordion.Control icon="🔤">Letter distribution</Accordion.Control>
          <Accordion.Panel>
            <LetterDistribution
              letterDistribution={letterDistribution}
              wordLengths={wordLengths}
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="tally">
          <Accordion.Control icon="📊">Letters tally</Accordion.Control>
          <Accordion.Panel>
            <LetterTally letterTally={getTally(2)} />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Modal>
  );
};

export default HintsModal;
