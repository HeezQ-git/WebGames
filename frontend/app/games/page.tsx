import { Stack, Text } from '@mantine/core';
import Link from 'next/link';
import React from 'react';

const page = () => {
  return (
    <Stack>
      <Text>Games:</Text>
      <Link href="/spelling-bee">Spelling Bee</Link>
      <Link href="/wordle">Wordle</Link>
    </Stack>
  );
};

export default page;
