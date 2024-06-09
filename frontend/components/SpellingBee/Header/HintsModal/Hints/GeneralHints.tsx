import React from 'react';
import { Code, Stack, Text, Tooltip } from '@mantine/core';

interface GeneralHintsProps {
  skipFound: boolean;
  wordsLeft: number;
  wordlistLength: number;
  pangramsLength: number;
  pangramsLeftLength: number;
  perfectPangramsLength: number;
  perfectPangramsLeftLength: number;
  bingo: boolean;
}

const GeneralHints: React.FC<GeneralHintsProps> = ({
  skipFound,
  wordsLeft,
  wordlistLength,
  pangramsLength,
  pangramsLeftLength,
  perfectPangramsLength,
  perfectPangramsLeftLength,
  bingo,
}) => {
  const data = [
    { label: 'Words', total: wordlistLength, left: wordsLeft },
    { label: 'Pangrams', total: pangramsLength, left: pangramsLeftLength },
    {
      label: 'Perfect pangrams',
      total: perfectPangramsLength,
      left: perfectPangramsLeftLength,
    },
  ];

  return (
    <Stack gap="xs">
      {data.map(({ label, total, left }) => (
        <Code key={label} fz="md">
          {skipFound ? `${label} left` : `${label} total`}:{' '}
          {skipFound ? left : total}
        </Code>
      ))}
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
  );
};

export default GeneralHints;
