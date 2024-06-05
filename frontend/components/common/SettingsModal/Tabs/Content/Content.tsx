import { fetcher } from '@/lib/fetcher';
import { Checkbox, Group, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useSession } from 'next-auth/react';
import React from 'react';
import toast from 'react-hot-toast';

const Content = () => {
  const { data: userData, status, update } = useSession();

  const form = useForm({
    initialValues: {
      profanesAllowed: userData?.user?.profanesAllowed ?? false,
    },
  });

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue('profanesAllowed', event.target.checked);

    toast.promise(
      fetcher('PATCH', { wholeResponse: true })('api/player/update', {
        profanesAllowed: event.target.checked,
      }),
      {
        loading: 'Updating settings...',
        success: () => {
          update({ profanesAllowed: event.target.checked });
          return 'Settings updated successfully';
        },
        error: () => {
          form.setFieldValue('profanesAllowed', !event.target.checked);
          return 'Failed to update settings';
        },
      },
      {
        position: 'top-right',
      }
    );
  };

  return (
    <Stack>
      <Group>
        <Checkbox
          label="Allow profane words?"
          description="Parental advisory is recommended"
          styles={{ icon: { color: 'white' }, description: { marginTop: 0 } }}
          disabled={status === 'loading'}
          key={form.key('profanesAllowed')}
          {...form.getInputProps('profanesAllowed')}
          onChange={handleChange}
          checked={form.values.profanesAllowed}
        />
      </Group>
    </Stack>
  );
};

export default Content;
