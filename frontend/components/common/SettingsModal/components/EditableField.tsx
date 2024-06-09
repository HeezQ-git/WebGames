import { Group, Stack, Text } from '@mantine/core';
import React from 'react';
import ActionIconsGroup from './ActionIconsGroup';

const EditableField = ({
  name,
  children,
  label,
}: {
  name: string;
  children?: React.ReactNode;
  label?: string;
}) => {
  return (
    <Stack gap="4px">
      <Text fz="md" fw="600">
        {label || name}
      </Text>
      <Group align="center" w="clamp(100px, 100%, 400px)" wrap="nowrap">
        <Stack gap="sm" w="clamp(100px, 100%, 400px)">
          {children}
        </Stack>
        <ActionIconsGroup fieldName={name} />
      </Group>
    </Stack>
  );
};

export default EditableField;
