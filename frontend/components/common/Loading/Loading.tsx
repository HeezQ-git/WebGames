import { Highlight, Loader, Stack } from '@mantine/core';
import React from 'react';

const Loading = () => {
  return (
    <Stack align="center" justify="center" w="100%" h="100%" gap="sm">
      <Highlight
        fz="32px"
        ta="center"
        highlight="Loading"
        highlightStyles={{
          animation: 'loadingGradient 2s ease infinite alternate',
          backgroundImage:
            'linear-gradient(45deg, var(--mantine-color-orange-7), var(--mantine-color-yellow-5))',
          fontWeight: 700,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Loading
      </Highlight>
      <Loader size="xl" type="bars" />
    </Stack>
  );
};

export default Loading;
