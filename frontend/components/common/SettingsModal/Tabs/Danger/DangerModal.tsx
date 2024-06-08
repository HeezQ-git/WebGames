import { fetcher } from '@/lib/fetcher';
import { useGlobalStore } from '@/stores/global';
import { useModalStore } from '@/stores/modal';
import { useSettingsStore } from '@/stores/settings';
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
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import React from 'react';
import toast from 'react-hot-toast';
import { MdOutlineDelete } from 'react-icons/md';

const DangerModal = () => {
  const { openModal, setOpenModal } = useModalStore();
  const { dangerAction } = useSettingsStore();
  const { fetchGames } = useGlobalStore();
  const router = useRouter();

  const form = useForm({
    initialValues: {
      confirm: '',
      agreement: false,
    },
    validate: {
      confirm: (value) => (value === 'CONFIRM' ? null : 'Invalid code'),
      agreement: (value) => (value ? null : 'You must agree to continue'),
    },
  });

  const handleDangerAction = async () => {
    if (dangerAction === 'reset') {
      const res = await fetcher('DELETE', { wholeResponse: true })(
        'api/player/progress'
      );

      if (res.status === 200) {
        toast.success('Progress reset successfully');
        await fetchGames?.();
      } else {
        toast.error('An error occurred while resetting your progress');
      }
    } else {
      const res = await fetcher('DELETE', { wholeResponse: true })(
        'api/player/account'
      );

      if (res.status === 200) {
        router.push('/signout');
        toast.success('Account deleted successfully');
      } else {
        toast.error('An error occurred while deleting your account');
      }
    }

    setOpenModal('SETTINGS');
  };

  return (
    <Modal
      opened={openModal === 'DANGER'}
      onClose={() => {
        setOpenModal('SETTINGS');
        form.reset();
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
