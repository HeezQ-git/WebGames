'use client';
import { Badge, Button, Card, Group, Stack, Text } from '@mantine/core';
import React from 'react';
import styles from './Games.module.css';
import Image from 'next/image';
import WordleImage from '@/assets/images/wordle.png';
import SpellingBeeImage from '@/assets/images/spelling_bee.png';
import Link from 'next/link';

const Games = () => {
  return (
    <Stack className={styles.games} gap="xs">
      <Text fz="h2">Games</Text>
      <Text>
        This is the games page. Here you will find all the games that we have
        available for you to play.
      </Text>
      <Group>
        <Card shadow="md" padding="lg" radius="md" withBorder w="300px">
          <Card.Section>
            <Image
              src={SpellingBeeImage}
              alt="Spelling Bee"
              className={styles.image}
            />
          </Card.Section>

          <Group justify="space-between" mt="md" mb="xs">
            <Text fw={500} tt="uppercase">
              Spelling Bee
            </Text>
          </Group>

          <Text size="sm" c="dimmed">
            Spelling Bee is a word puzzle game. The goal is to spell as many
            words as you can using the seven letters provided.
          </Text>

          <Link href="/spelling-bee">
            <Button color="gold.8" fullWidth mt="md" radius="md">
              Play now
            </Button>
          </Link>
        </Card>
        <Card shadow="md" padding="lg" radius="md" withBorder w="300px">
          <Card.Section>
            <Image src={WordleImage} alt="Wordle" className={styles.image} />
          </Card.Section>

          <Group justify="space-between" mt="md" mb="xs">
            <Text fw={500} tt="uppercase">
              Wordle
            </Text>
            <Badge color="violet">New</Badge>
          </Group>

          <Text size="sm" c="dimmed">
            Wordle is a word puzzle game. The goal is to guess a five-letter
            word in six attempts.
          </Text>

          <Link href="/wordle">
            <Button color="var(--wordle-green)" fullWidth mt="md" radius="md">
              Play now
            </Button>
          </Link>
        </Card>
      </Group>
    </Stack>
  );
};

export default Games;
