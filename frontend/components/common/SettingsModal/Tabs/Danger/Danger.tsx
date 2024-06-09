import { Button, Divider, Stack, Text } from '@mantine/core';
import React from 'react';
import { MdOutlineDelete, MdOutlineRefresh } from 'react-icons/md';
import DangerModal from './DangerModal';
import { useSettingsStore } from '@/stores/settingsStore';
import { useModalStore } from '@/stores/modalStore';

const Danger = () => {
  const { setDangerAction } = useSettingsStore();
  const { setOpenModal } = useModalStore();

  return (
    <Stack>
      <Stack gap="sm">
        <Stack gap="0">
          <Text fz="md" fw="600">
            Reset my progress
          </Text>
          <Text fz="sm" opacity={0.65}>
            All of your games and progress will be deleted.
          </Text>
        </Stack>
        <Button
          color="red.6"
          variant="outline"
          leftSection={<MdOutlineRefresh size={16} />}
          w="max-content"
          onClick={() => {
            setDangerAction('reset');
            setOpenModal('DANGER');
          }}
        >
          Reset progress
        </Button>
      </Stack>
      <Divider />
      <Stack gap="sm">
        <Stack gap="0">
          <Text fz="md" fw="600">
            Delete your account
          </Text>
          <Text fz="sm" opacity={0.65}>
            Deleting your account is irreversible and will remove all your data.
          </Text>
        </Stack>
        <Button
          color="red.6"
          variant="outline"
          leftSection={<MdOutlineDelete size={16} />}
          w="max-content"
          onClick={() => {
            setDangerAction('delete');
            setOpenModal('DANGER');
          }}
        >
          Delete account
        </Button>
      </Stack>
      <DangerModal />
    </Stack>
  );
};

export default Danger;
