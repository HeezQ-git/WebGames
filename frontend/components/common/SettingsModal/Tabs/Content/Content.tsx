/* eslint-disable indent */
import { fetcher } from '@/lib/fetcher';
import { Checkbox, Select, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Content = () => {
  const [loading, setLoading] = useState(false);
  const { data: userData, status, update } = useSession();

  const form = useForm({
    initialValues: {
      profanesAllowed: userData?.user?.settings?.profanesAllowed ?? false,
      wordListSortBy:
        userData?.user?.settings?.wordListSortBy ?? 'ALPHABETICAL',
    },
  });

  const handleCheckboxChange =
    (checkboxName: string) =>
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (loading) return;

      setLoading(true);
      form.setFieldValue(checkboxName, event.target.checked);

      await toast.promise(
        fetcher('PATCH', { wholeResponse: true })('api/player/update', {
          ...userData?.user?.settings,
          [checkboxName]: event.target.checked,
        }),
        {
          loading: 'Updating settings...',
          success: () => {
            update({
              settings: {
                ...userData?.user?.settings,
                [checkboxName]: event.target.checked,
              },
            });
            return 'Settings updated successfully';
          },
          error: () => {
            form.setFieldValue(checkboxName, !event.target.checked);
            return 'Failed to update settings';
          },
        },
        {
          position: 'top-right',
        }
      );

      setLoading(false);
    };

  const handleSelectChange =
    (selectName: string) => async (value: string | null) => {
      if (loading) return;

      setLoading(true);
      form.setFieldValue(selectName, value);

      await toast.promise(
        fetcher('PATCH', { wholeResponse: true })('api/player/update', {
          ...userData?.user?.settings,
          [selectName]: value,
        }),
        {
          loading: 'Updating settings...',
          success: () => {
            update({
              settings: {
                ...userData?.user?.settings,
                [selectName]: value,
              },
            });
            return 'Settings updated successfully';
          },
          error: () => {
            form.setFieldValue(
              selectName,
              (userData?.user?.settings as any)?.[selectName] ?? 'ALPHABETICAL'
            );
            return 'Failed to update settings';
          },
        },
        {
          position: 'top-right',
        }
      );

      setLoading(false);
    };

  return (
    <Stack gap="lg">
      <Select
        label="Word list sort order"
        placeholder="Select sort order"
        data={[
          { value: 'ALPHABETICAL', label: 'Alphabetical order' },
          { value: 'LATEST_FIRST', label: 'Latest word first' },
          { value: 'OLDEST_FIRST', label: 'Oldest word first' },
        ]}
        allowDeselect={false}
        disabled={status === 'loading' || loading}
        key={form.key('wordListSortBy')}
        {...form.getInputProps('wordListSortBy')}
        onChange={handleSelectChange('wordListSortBy')}
      />
      <Checkbox
        label="Allow profane words?"
        description="Parental advisory is recommended"
        styles={{ icon: { color: 'white' }, description: { marginTop: 0 } }}
        disabled={status === 'loading' || loading}
        key={form.key('profanesAllowed')}
        {...form.getInputProps('profanesAllowed')}
        onChange={handleCheckboxChange('profanesAllowed')}
        checked={form.values.profanesAllowed}
      />
    </Stack>
  );
};

export default Content;
