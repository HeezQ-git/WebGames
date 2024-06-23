import React from 'react';
import { Stack, Text } from '@mantine/core';

interface StatBoxProps {
  label: string;
  value: number;
  extra?: string;
}

const StatBox: React.FC<StatBoxProps> = ({ label, value, extra }) => (
  <Stack align="center" gap="0" w="20%">
    <Text fz="2.5rem">{value}</Text>
    <Text fz="sm" ta="center">
      {label} {extra}
    </Text>
  </Stack>
);

export default StatBox;
