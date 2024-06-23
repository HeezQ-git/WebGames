'use client';

import React from 'react';
import {
  Button,
  Checkbox,
  Code,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { MdOutlineDelete } from 'react-icons/md';
import toast from 'react-hot-toast';
import { useDangerAction } from '../hooks/useDangerAction';
import { useModalStore } from '@/stores/modalStore';

const DangerModal = () => {
  const { openModal } = useModalStore();
  const { form, handleDangerAction, setOpenModal, dangerAction } =
    useDangerAction();

  return (
    <Modal
      opened={openModal === 'DANGER'}
      onClose={() => {
        setOpenModal('SETTINGS');
        form?.reset();
      }}
      title={
        <Text fw="600">
          Confirm{' '}
          {dangerAction === 'reset' ? 'progress reset' : 'account deletion'}
        </Text>
      }
      centered
      size="xl"
      overlayProps={{
        backgroundOpacity: 0.6,
        blur: 5,
      }}
    >
      <form onSubmit={form.onSubmit(handleDangerAction)}>
        <Stack gap="sm">
          <Text>
            To confirm this action, please type <Code fz="md">CONFIRM</Code> in
            the field below.
          </Text>
          <TextInput
            placeholder="Type here..."
            onPaste={(event) => {
              event.preventDefault();
              toast.error(
                'Pasting is disabled for this field. Please type the code manually.'
              );
            }}
            key={form.key('confirm')}
            {...form.getInputProps('confirm')}
          />
          <Checkbox
            label="I understand that this action is irreversible"
            required
            key={form.key('agreement')}
            {...form.getInputProps('agreement')}
            checked={form.values.agreement}
          />
        </Stack>
        <Group mt="xl" justify="flex-end">
          <Button variant="outline" onClick={() => setOpenModal('SETTINGS')}>
            Cancel
          </Button>
          <Button
            color="red.7"
            type="submit"
            leftSection={<MdOutlineDelete size={16} />}
          >
            {dangerAction === 'reset' ? 'Reset progress' : 'Delete account'}
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default DangerModal;
