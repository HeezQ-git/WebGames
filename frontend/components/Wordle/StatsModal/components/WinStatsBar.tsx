import React from 'react';
import { Group, Flex, Text } from '@mantine/core';
import styles from '../StatsModal.module.css';

interface WinStatsBarProps {
  guessNumber: number;
  width: number;
  count: number;
  isCurrent: boolean;
}

const WinStatsBar: React.FC<WinStatsBarProps> = ({
  guessNumber,
  width,
  count,
  isCurrent,
}) => (
  <Group gap="xs" wrap="nowrap">
    <Text>{guessNumber}</Text>
    <Flex
      px="4px"
      ta="center"
      fw="bold"
      justify="flex-end"
      data-is-current={isCurrent}
      className={styles.winStatsBar}
      w={width > 0 ? `${width}%` : 'auto'}
    >
      {count || 0}
    </Flex>
  </Group>
);

export default WinStatsBar;
