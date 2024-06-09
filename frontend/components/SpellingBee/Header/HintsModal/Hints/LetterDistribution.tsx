import React from 'react';
import { Code, Divider, Stack, Text, Tooltip } from '@mantine/core';

interface LetterDistributionProps {
  letterDistribution: Record<string, number>;
  wordLengths: Record<number, number>;
}

const LetterDistribution: React.FC<LetterDistributionProps> = ({
  letterDistribution,
  wordLengths,
}) => (
  <>
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
  </>
);

export default LetterDistribution;
