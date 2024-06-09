import React from 'react';
import { Code, Group } from '@mantine/core';

interface LetterTallyProps {
  letterTally: Record<string, number>;
}

const LetterTally: React.FC<LetterTallyProps> = ({ letterTally }) => (
  <Group gap="xs">
    {Object.entries(letterTally)
      .sort(([, a], [, b]) => b - a)
      .map(([letters, amount]) => (
        <Code key={letters} fz="md">
          {letters} x {amount}
        </Code>
      ))}
  </Group>
);

export default LetterTally;
