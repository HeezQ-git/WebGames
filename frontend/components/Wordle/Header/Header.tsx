import { useModalStore } from '@/stores/modalStore';
import {
  ActionIcon,
  Divider,
  Group,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import React from 'react';
import { MdOutlineBarChart } from 'react-icons/md';

const Header = () => {
  const { setOpenModal } = useModalStore();

  return (
    <Stack w="100%" maw="350px" mt="md">
      <Group align="center" justify="space-between" px="xs">
        <Text fz="xl" fw="bold">
          Wordle
        </Text>
        <Group gap="xs" justify="flex-end">
          <Tooltip label="Statistics" position="bottom" withArrow>
            <ActionIcon
              size="lg"
              variant="light"
              onClick={() => setOpenModal('STATS')}
            >
              <MdOutlineBarChart size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
      <Divider />
    </Stack>
  );
};

export default Header;
